import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { Card } from 'src/card/entity/card.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Repository } from 'typeorm';
import { AuthorizePaymentDto } from './dto/authorize-payment.dto';
import { validateCvv, validateExpiry } from './utils/authorization.util';
import {
  Authorization,
  AuthorizationStatus,
} from './entity/authorization-record.entity';

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
  ) {}

  async authorizePayment(body: AuthorizePaymentDto) {
    try {
      // 1️⃣ Find card (NO CVV CHECK HERE)
      const card = await this.cardRepo.findOne({
        where: {
          cardNumber: body.cardNumber,
          expiryMonth: Number(body.expiryMonth),
          expiryYear: Number(body.expiryYear),
        },
        relations: ['account'],
      });

      if (!card) {
        throw new HttpException('CARD_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }

      if (card.status !== 'active') {
        throw new HttpException('CARD_NOT_ACTIVE', HttpStatus.BAD_REQUEST);
      }

      // 2️⃣ Validate CVV (format only)
      const isValidCVV = validateCvv(body.cvv, card.cardNumber);
      if (!isValidCVV) {
        throw new HttpException('INVALID_CVV', HttpStatus.BAD_REQUEST);
      }

      // 3️⃣ Validate Expiry
      const isExpiryValid = validateExpiry(
        card.expiryMonth.toString(),
        card.expiryYear.toString(),
      );

      if (!isExpiryValid) {
        throw new HttpException('CARD_EXPIRED', HttpStatus.BAD_REQUEST);
      }

      const account = card.account;

      // 4️⃣ Check available balance (balance - blocked)
      const availableBalance = account.balance - account.blockedAmount;

      if (availableBalance < body.amount) {
        throw new HttpException('INSUFFICIENT_BALANCE', HttpStatus.BAD_REQUEST);
      }

      // 5️⃣ Block amount
      account.blockedAmount += body.amount;
      await this.accountRepo.save(account);

      // 6️⃣ Create authorization record
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 min hold

      const authorization = this.authorizationRepo.create({
        cardId: card.id,
        accountId: account.id,
        merchantId: body.merchantId,
        orderId: body.orderId,
        amount: body.amount,
        currency: body.currency,
        status: AuthorizationStatus.AUTHORIZED,
        expiresAt,
      });

      const savedAuth = await this.authorizationRepo.save(authorization);

      // 7️⃣ Return success response
      return {
        status: 'APPROVED',
        bankReferenceCode: savedAuth.id,
        authorizedAmount: body.amount,
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
}
