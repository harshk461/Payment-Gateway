import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { Card } from 'src/card/entity/card.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import {
  PaymentMethod,
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transactions/entity/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthorizePaymentDto } from './dto/authorize-payment.dto';
import {
  generateTransactionReference,
  validateExpiry,
} from './utils/authorization.util';
import {
  Authorization,
  AuthorizationStatus,
} from './entity/authorization-record.entity';
import { TokenizationClient } from 'src/infra/tokenization/tokenization.client';
import { CapturePaymentDto } from './dto/capture-payment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(BankCustomer)
    private customerRepo: Repository<BankCustomer>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Authorization)
    private authorizationRepo: Repository<Authorization>,
    private readonly tokenizationClient: TokenizationClient,
    private readonly dataSource: DataSource,
  ) {}

  async authorizePayment(body: AuthorizePaymentDto) {
    try {
      // 1️⃣ Resolve token → card details
      const tokenData = await this.tokenizationClient.resolveToken(
        body.paymentMethodToken,
      );

      if (!tokenData) {
        throw new HttpException(
          'INVALID_PAYMENT_TOKEN',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2️⃣ Find card using resolved identity
      const card = await this.cardRepo.findOne({
        where: {
          cardNumber: tokenData.cardNumber,
          expiryMonth: tokenData.expiryMonth,
          expiryYear: tokenData.expiryYear,
        },
        relations: ['account'],
      });

      if (!card) {
        throw new HttpException('CARD_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }

      if (card.status !== 'active') {
        throw new HttpException('CARD_NOT_ACTIVE', HttpStatus.BAD_REQUEST);
      }

      // 3️⃣ Expiry validation (issuer-side)
      const isExpiryValid = validateExpiry(
        card.expiryMonth.toString(),
        card.expiryYear.toString(),
      );

      if (!isExpiryValid) {
        throw new HttpException('CARD_EXPIRED', HttpStatus.BAD_REQUEST);
      }

      const account = card.account;

      // 4️⃣ Available balance check
      const availableBalance = account.balance - account.blockedAmount;

      if (availableBalance < Number(body.amount) / 100) {
        throw new HttpException('INSUFFICIENT_BALANCE', HttpStatus.BAD_REQUEST);
      }

      // 5️⃣ Block funds
      account.blockedAmount += Number(body.amount) / 100;
      await this.accountRepo.save(account);

      // 6️⃣ Create authorization
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const authorization = this.authorizationRepo.create({
        cardId: card.id,
        accountId: account.id,
        merchantId: body.merchantId || '1',
        orderId: body.orderId || '',
        amount: Number(body.amount) / 100,
        currency: body.currency,
        status: AuthorizationStatus.AUTHORIZED,
        expiresAt,
      });

      const savedAuth = await this.authorizationRepo.save(authorization);

      // 7️⃣ Response
      return {
        status: 'APPROVED',
        approved: true,
        bankReferenceCode: savedAuth.id,
        authorizedAmount: Number(body.amount) / 100,
        expiresAt: savedAuth.expiresAt,
      };
    } catch (err) {
      console.error('Authorize Payment Error', err);

      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'BANK_AUTHORIZATION_FAILED',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async capturePayment(body: CapturePaymentDto) {
    return this.dataSource.transaction(async (manager) => {
      // 1️⃣ Fetch authorization (LOCKED)
      const authorization = await manager.findOne(Authorization, {
        where: { id: body.bankReferenceCode },
        lock: { mode: 'pessimistic_write' },
      });

      if (!authorization) {
        throw new HttpException(
          'AUTHORIZATION_NOT_FOUND',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (authorization.status !== AuthorizationStatus.AUTHORIZED) {
        throw new HttpException(
          'AUTHORIZATION_NOT_CAPTURABLE',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (authorization.expiresAt < new Date()) {
        authorization.status = AuthorizationStatus.EXPIRED;
        await manager.save(authorization);

        throw new HttpException(
          'AUTHORIZATION_EXPIRED',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2️⃣ Fetch account (LOCKED)
      const account = await manager.findOne(Account, {
        where: { id: authorization.accountId },
        lock: { mode: 'pessimistic_write' },
        relations: ['customer'],
      });

      if (!account) {
        throw new HttpException('ACCOUNT_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }

      const captureAmount = body.amount ?? authorization.amount;

      if (captureAmount > authorization.amount) {
        throw new HttpException(
          'CAPTURE_AMOUNT_EXCEEDS_AUTH',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (account.blockedAmount < captureAmount) {
        throw new HttpException(
          'BLOCKED_AMOUNT_INSUFFICIENT',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3️⃣ Balance snapshot
      const balanceBefore = account.balance;
      const balanceAfter = balanceBefore - captureAmount;

      // 4️⃣ Update account balances
      account.balance = balanceAfter;
      account.blockedAmount -= captureAmount;

      await manager.save(account);

      // 5️⃣ Mark authorization CAPTURED
      authorization.status = AuthorizationStatus.CAPTURED;
      authorization.capturedAt = new Date();
      await manager.save(authorization);

      // 6️⃣ Create transaction record (FULLY POPULATED)
      const transaction = manager.create(Transaction, {
        id: randomUUID().replace(/-/g, '').slice(0, 20), // fits length: 20
        txnReference: generateTransactionReference(),

        accountId: account.id,
        customerId: account.customer.id,
        cardId: authorization.cardId,

        type: TransactionType.DEBIT,
        amount: captureAmount,

        balanceBefore,
        balanceAfter,

        status: TransactionStatus.COMPLETED,
        paymentMethod: PaymentMethod.CARD,

        sourceReference: authorization.id,
        description: 'Card payment capture',

        transactionFee: 0,
        gstAmount: 0,

        initiatedAt: authorization.createdAt,
        completedAt: new Date(),
      });

      const savedTxn = await manager.save(transaction);

      // 7️⃣ Return response
      return {
        status: 'CAPTURED',
        captured: true,
        paymentId: savedTxn.id,
        txnReference: savedTxn.txnReference,
        balanceAfter: savedTxn.balanceAfter,
      };
    });
  }
}
