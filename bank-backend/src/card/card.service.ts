// cards/cards.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, CardStatus } from './entity/card.entity';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { generateCardId, generateCardNumber } from './util/card.util';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(BankCustomer)
    private customerRepo: Repository<BankCustomer>,
  ) {}

  async generateCard(dto: CreateCardDto): Promise<Card> {
    // Validate customer exists
    const customer = await this.customerRepo.findOne({
      where: { customerId: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer ${dto.customerId} not found`);
    }

    // Validate account exists & belongs to customer
    const account = await this.accountRepo.findOne({
      where: { accountNumber: dto.accountId, customerId: customer.id },
    });
    if (!account) {
      throw new NotFoundException(
        `Account ${dto.accountId} not found or doesn't belong to customer`,
      );
    }

    // Backend auto-generates secure details
    const cardId = generateCardId();
    const cardNumberRaw = generateCardNumber(dto.network);
    const cvv = Math.floor(Math.random() * 900 + 100).toString(); // 100-999

    const now = new Date();
    const expiryMonth = ((now.getMonth() + 1 + 36) % 12) + 1; // +3 years
    const expiryYear = now.getFullYear() + 3;

    const card = this.cardRepo.create({
      id: cardId,
      cardNumber: cardNumberRaw,
      accountId: account.id,
      customerId: customer.id,
      cardType: dto.cardType,
      network: dto.network,
      cardholderName: dto.cardholderName.toUpperCase(),
      expiryMonth,
      expiryYear,
      cvv,
      creditLimit: dto.cardType === 'debit' ? 0 : 100000, // Default credit limit
      currentBalance: 0,
      dailyLimit: dto.dailyLimit || 50000,
      internationalEnabled: dto.internationalEnabled || 1,
      contactlessEnabled: dto.contactlessEnabled || 1,
      otpEnabled: dto.otpEnabled || 1,
      issuedDate: now.toISOString().split('T')[0],
      status: CardStatus.ACTIVE,
    });

    return this.cardRepo.save(card);
  }

  async getCardsByAccount(accountId: string): Promise<Card[]> {
    return this.cardRepo.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
    });
  }

  async getCardById(cardId: string): Promise<any> {
    const card = await this.cardRepo
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.card_number as cardNumber',
        'c.cardholder_name as cardholderName',
        'c.card_type as cardType',
        'c.network as network',
        'c.status as status',
        'c.daily_limit as dailyLimit',
        'c.current_balance as currentBalance',
        'c.expiry_month as expiryMonth',
        'c.expiry_year as expiryYear',
        'bc.name as customerName',
        'bc.id as customerId',
        'a.account_number as linkedAccount',
        'a.id as accountId',
      ])
      .leftJoin('bank_customers', 'bc', 'bc.id = c.customerId')
      .leftJoin('bank_customer_accounts', 'a', 'a.id = c.accountId')
      .where('c.id = :cardId', { cardId })
      .getRawOne();

    if (!card) {
      throw new NotFoundException(`Card ${cardId} not found`);
    }

    return {
      id: card.id,
      customer: card.customerName,
      customerId: card.customerId,
      linkedAccount: card.linkedAccount || card.accountId,
      network: card.network,
      last4: card.cardNumber.slice(-4),
      status: card.status,
      limit: parseFloat(card.dailyLimit) || 0,
      available:
        parseFloat(card.dailyLimit || 0) - parseFloat(card.currentBalance || 0),
      utilization: Math.round(
        (parseFloat(card.currentBalance || 0) /
          parseFloat(card.dailyLimit || 1)) *
          100,
      ),
      cardholderName: card.cardholderName,
      expiry: `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`,
    };
  }

  // cards/cards.service.ts
  async getAllCards() {
    const cards = await this.cardRepo
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.card_number as cardNumber',
        'c.card_type as cardType',
        'c.network as network',
        'c.status as status',
        'c.daily_limit as dailyLimit',
        'c.current_balance as currentBalance',
        'bc.name as customerName',
        'bc.id as customerId',
        'a.account_number as linkedAccount',
        'a.id as accountId',
      ])
      .leftJoin('bank_customers', 'bc', 'bc.id = c.customerId')
      .leftJoin('bank_customer_accounts', 'a', 'a.id = c.accountId')
      .orderBy('c.createdAt', 'DESC')
      .getRawMany();

    // Calculate stats
    const totalCards = cards.length;
    const activeCards = cards.filter((c) => c.status === 'active').length;
    const avgUtilization =
      totalCards > 0
        ? (cards.reduce(
            (sum, c) => sum + parseFloat(c.currentBalance || 0),
            0,
          ) /
            cards.reduce((sum, c) => sum + parseFloat(c.dailyLimit || 0), 0)) *
            100 || 0
        : 0;

    return {
      cards: cards.map((card) => ({
        id: card.id,
        customer: card.customerName,
        customerId: card.customerId,
        linkedAccount: card.linkedAccount || card.accountId,
        network: card.network,
        last4: card.cardNumber.slice(-4),
        status: card.status,
        limit: parseFloat(card.dailyLimit) || 0,
        utilization: Math.round(
          (parseFloat(card.currentBalance || 0) /
            parseFloat(card.dailyLimit || 1)) *
            100,
        ),
      })),
      stats: {
        totalCards,
        activeCount: activeCards,
        activePercentage:
          totalCards > 0 ? Math.round((activeCards / totalCards) * 100) : 0,
        avgUtilization: avgUtilization.toFixed(1),
      },
    };
  }
}
