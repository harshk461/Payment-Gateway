import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/card/entity/card.entity';
import { BankCustomerAddress } from 'src/customer/entity/customer-address.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Repository } from 'typeorm';
import { Branch } from './entity/branch.entity';
import { Account } from './entity/customer-account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { Transaction } from 'src/transactions/entity/transaction.entity';

@Injectable()
export class AccountsService {
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

  async getAllAccounts(): Promise<{ accounts: any[] }> {
    const accounts = await this.accountRepo
      .createQueryBuilder('ba')
      .select([
        'ba.id',
        'ba.accountNumber as accountNumber', // Fixed column name
        'ba.accountType as accountType',
        'ba.accountStatus as accountStatus',
        'ba.balance as balance',
        'ba.interest_rate as interestRate',
        'ba.createdAt as openedDate',
        'bc.name as customerName', // Fixed table/column
        'bc.id as customerId',
        'bb.branch_name as branchName', // Fixed column name
        'bb.id as branchId',
      ])
      .leftJoin('bank_customers', 'bc', 'bc.id = ba.customerId') // Fixed join condition
      .leftJoin('bank_branches', 'bb', 'bb.id = ba.branchId')
      .getRawMany();

    return {
      accounts: accounts.map((account) => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountStatus: account.accountStatus,
        balance: parseFloat(account.balance) || 0,
        interestRate: parseFloat(account.interestRate) || 0,
        openedDate: account.openedDate,
        customer: {
          id: account.customerId,
          name: account.customerName,
        },
        branch: {
          id: account.branchId,
          name: account.branchName,
        },
      })),
    };
  }

  async getCustomerAccounts(id: string) {
    const customer = await this.customerRepo.findOne({
      where: {
        customerId: id,
      },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    const accounts = await this.accountRepo
      .createQueryBuilder('ba')
      .select([
        'ba.id as id',
        'ba.account_number as accountNumber',
        'ba.account_type as accountType',
        'ba.balance as balance',
        'bb.branch_name as branch',
      ])
      .leftJoinAndSelect(
        'bank_customers',
        'bc',
        'bc.customer_id=ba.customer_id',
      )
      .leftJoinAndSelect('bank_branches', 'bb', 'bb.id=ba.branch_id')
      .where('ba.customer_id=:customer_id', { customer_id: id })
      .getRawMany();

    return { accounts };
  }

  async getAccountById(accountId: string): Promise<any> {
    const account = await this.accountRepo
      .createQueryBuilder('ba')
      .select([
        'ba.id as id',
        'ba.account_number as accountNumber',
        'ba.account_type as accountType',
        'ba.account_status as accountStatus',
        'ba.balance as balance',
        'ba.interest_rate as interestRate',
        'ba.created_at as openedDate',
        'bc.name as customerName',
        'bc.id as customerId',
        'bb.branch_name as branchName',
        'bb.id as branchId',
        'bb.branch_code as branchCode',
      ])
      .leftJoin('bank_customers', 'bc', 'bc.id = ba.customerId')
      .leftJoin('bank_branches', 'bb', 'bb.id = ba.branchId')
      .where('ba.id = :id OR ba.accountNumber = :accountNumber', {
        id: accountId,
        accountNumber: accountId,
      })
      .getRawOne();

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Get recent transactions
    const recentTransactions = await this.accountRepo
      .createQueryBuilder('ba')
      .select([
        'txn.id as id',
        'txn.amount as amount',
        'txn.type as type',
        'txn.description as description',
        'txn.created_at as createdAt',
      ])
      .leftJoin('bank_transactions', 'txn', 'txn.account_id = ba.id')
      .where('ba.id = :accountId', { accountId: account.id })
      .orderBy('txn.created_at', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      id: account.accountNumber,
      type: account.accountType,
      holder: account.customerName,
      holderId: account.customerId,
      balance: parseFloat(account.balance) || 0,
      availableBalance: parseFloat(account.balance) || 0, // Add overdraft logic later
      interestRate: `${parseFloat(account.interestRate || 0).toFixed(1)}%`,
      branch: `${account.branchName} - ${account.branchCode}`,
      opened: new Date(account.openedDate).toLocaleDateString('en-IN'),
      status: account.accountStatus,
      transactions: recentTransactions
        .filter((item) => item.id != null)
        .map((txn) => ({
          id: txn.id,
          amount: parseInt(txn.amount),
          type: txn.type,
          date: new Date(txn.createdAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
          }),
          description: txn.description || 'Transaction',
        })),
    };
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    // Validate customer exists
    const customer = await this.customerRepo.findOne({
      where: { customerId: createAccountDto.customerId },
    });
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    // Validate branch exists
    const branch = await this.branchRepo.findOne({
      where: { branchCode: createAccountDto.branchId },
    });
    if (!branch) {
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);
    }

    // Check account number uniqueness
    const existingAccount = await this.accountRepo.findOne({
      where: { accountNumber: createAccountDto.accountNumber },
    });
    if (existingAccount) {
      throw new HttpException(
        'Account number already exists',
        HttpStatus.CONFLICT,
      );
    }

    const account = this.accountRepo.create({
      id: `ACC${Date.now()}`,
      ...createAccountDto,
      customerId: customer.id,
      cifNumber: this.generateCifNumber(),
      branchId: branch.id,
    });

    return this.accountRepo.save(account);
  }

  private generateCifNumber() {
    const now = new Date();
    const datePart =
      now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');

    const randomPart = Math.floor(Math.random() * 9000 + 1000); // 1000-9999

    return `CIF-${datePart}-${randomPart}`;
  }
}
