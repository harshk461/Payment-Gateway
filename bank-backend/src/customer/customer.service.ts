import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankCustomer } from './entity/customer.entity';
import { Not, Repository } from 'typeorm';
import { BankCustomerAddress } from './entity/customer-address.entity';
import {
  Account,
  AccountStatus,
} from 'src/accounts/entity/customer-account.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { CreateCustomerWithAddressDto } from './dto/create-customer.dto';
import { Branch } from 'src/accounts/entity/branch.entity';
import { Card, CardStatus } from 'src/card/entity/card.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(BankCustomer)
    private customerRepo: Repository<BankCustomer>,
    @InjectRepository(BankCustomerAddress)
    private customerAddressRepo: Repository<BankCustomerAddress>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
  ) {}

  async createNewCustomer(dto: CreateCustomerWithAddressDto) {
    try {
      const { customer, address } = dto;

      // ✅ FIXED: Check both phone & email
      const [customerNumberExists, customerEmailExists] = await Promise.all([
        this.customerRepo.findOne({
          where: {
            phone: customer.phone,
          },
        }),
        this.customerRepo.findOne({
          where: {
            email: customer.email,
          },
        }),
      ]);

      if (customerNumberExists) {
        throw new HttpException(
          'Customer with phone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (customerEmailExists) {
        throw new HttpException(
          'Customer with email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // ✅ FIXED: Match your entity fields (no accountType/balance/status)
      const newCustomerBody = {
        customerId: `CUST${Date.now()}`, // Generate CUST001 format
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        kycStatus: customer.kycStatus || 'pending',
        branchId: customer.branchId, // Required field
      };

      const newCustomer = await this.customerRepo.save(newCustomerBody);

      // ✅ FIXED: Address relationship
      const newCustomerAddress = {
        customerId: newCustomer.id,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        country: 'INDIA',
      };

      await this.customerAddressRepo.save(newCustomerAddress);

      return {
        message: 'New customer added successfully',
        customerId: newCustomer.customerId,
        uuid: newCustomer.id,
      };
    } catch (err: any) {
      console.error('Error Creating Customer:', err);
      throw new HttpException(
        err.message || 'Error creating customer',
        err.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAllCustomers(limit = 10, page = 1) {
    try {
      const take = Number(limit);
      const currentPage = Number(page);
      const skip = (currentPage - 1) * take;

      // ✅ FIXED: Proper pagination with relations & correct fields
      const [customers, total] = await this.customerRepo.findAndCount({
        select: [
          'id',
          'customerId',
          'name',
          'email',
          'phone',
          'kycStatus',
          'joinedAt',
          'lastLoginAt',
          'createdAt',
        ],
        relations: ['branch'],
        order: {
          createdAt: 'DESC',
        },
        take,
        skip,
      });

      // ✅ FIXED: Real transaction counts per customer
      const customerIds = customers.map((c) => c.id);
      const transactionCounts = await this.transactionRepo
        .createQueryBuilder('txn')
        .select('txn.customer_id', 'customerId')
        .addSelect('COUNT(*)', 'count')
        .where('txn.customer_id IN (:...ids)', { ids: customerIds })
        .groupBy('txn.customer_id')
        .getRawMany();

      const countMap = Object.fromEntries(
        transactionCounts.map((row: any) => [
          row.customerId,
          parseInt(row.count),
        ]),
      );

      const finalCustomers = customers.map((customer) => ({
        ...customer,
        branchName: customer.branch?.branchName || 'N/A',
        totalTransactions: countMap[customer.id] || 0,
        accountsCount: 0, // Can add account count query if needed
      }));

      // ✅ FIXED: Proper analytics (matches entity)
      const totalCustomers = await this.customerRepo.count();
      const totalKYCVerified = await this.customerRepo.count({
        where: { kycStatus: 'verified' },
      });
      const totalActive = totalCustomers; // All customers are active by default

      return {
        customers: finalCustomers,
        meta: {
          total,
          page: currentPage,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
        analytics: {
          totalCustomers,
          totalKYCVerified,
          kycVerifiedPercent: totalCustomers
            ? ((totalKYCVerified / totalCustomers) * 100).toFixed(1) + '%'
            : '0%',
          totalActive,
        },
      };
    } catch (err) {
      console.error('Error Fetching All Customers:', err);
      throw new HttpException(
        'Error fetching customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCustomer(id: string) {
    try {
      // ✅ NO RELATIONS - Separate queries only
      const customer = await this.customerRepo.findOne({
        where: { id },
        select: [
          'id',
          'customerId',
          'name',
          'email',
          'phone',
          'kycStatus',
          'joinedAt',
          'lastLoginAt',
          'createdAt',
          'branchId',
        ],
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      // ✅ SEPARATE QUERIES - No TypeORM relation magic
      const [
        branch,
        address,
        accounts,
        totalTransactions,
        avgTransactionAmount,
      ] = await Promise.all([
        // Branch
        this.branchRepo.findOne({
          where: { id: customer.branchId },
          select: ['branchName'],
        }),

        // Address
        this.customerAddressRepo.findOne({
          where: { customerId: customer.id },
        }),

        // Accounts (no soft delete issues)
        this.accountRepo.find({
          where: {
            customerId: customer.id,
            accountStatus: Not(AccountStatus.CLOSED),
          },
          select: [
            'id',
            'accountNumber',
            'accountType',
            'balance',
            'accountStatus',
          ],
        }),

        // Cards
        this.cardRepo.find({
          where: {
            customerId: customer.id,
            status: CardStatus.ACTIVE,
          },
          select: ['id', 'cardNumber', 'status'],
        }),

        // Transaction count
        this.transactionRepo.count({ where: { customerId: customer.id } }),

        // Average transaction
        this.transactionRepo
          .createQueryBuilder('txn')
          .select('AVG(txn.amount)', 'avg')
          .where('txn.customer_id = :id', { id: customer.id })
          .getRawOne(),
      ]);

      const totalBalance = accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.balance.toString() || '0.0'),
        0.0,
      );

      return {
        id: customer.id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        kycStatus: customer.kycStatus,
        branch: branch?.branchName || 'N/A',
        joinedAt: customer.joinedAt,
        lastLoginAt: customer.lastLoginAt || null,
        totalTransactions,
        avgTransactionAmount: parseFloat(
          avgTransactionAmount?.toFixed() || '0',
        ),
        recentTransactions: [], // Add if needed
        accounts: {
          count: accounts.length,
          totalBalance,
          details: accounts,
        },
        address: address
          ? {
              addressLine1: address.addressLine1,
              city: address.city,
              state: address.state,
              pinCode: address.pinCode,
              country: address.country,
            }
          : null,
      };
    } catch (err: any) {
      console.error('Error Fetching Customer:', err);
      throw new HttpException(
        err.message || 'Error fetching customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
