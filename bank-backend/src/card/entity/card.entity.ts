import { Account } from 'src/accounts/entity/customer-account.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum CardType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  PREPAID = 'prepaid',
}

export enum CardNetwork {
  VISA = 'VISA',
  MASTERCARD = 'MasterCard',
  RUPAY = 'RUPAY',
  AMEX = 'AMEX',
}

export enum CardStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  HOTLISTED = 'hotlisted',
}

@Entity('bank_cards')
// ✅ FIXED: Single column indexes (string)
@Index('IDX_cards_customer_id', ['customerId'])
@Index('IDX_cards_account_id', ['accountId'])
@Index('IDX_cards_status', ['status'])
@Index('IDX_cards_expiry', ['expiryMonth', 'expiryYear'])
@Index('IDX_cards_customer_status', ['customerId', 'status'])
export class Card {
  @PrimaryColumn({ length: 20 })
  id: string;

  @Column({ name: 'card_number', length: 19, unique: true })
  cardNumber: string;

  @Column({ name: 'account_id', length: 36 })
  accountId: string;

  @Column({ name: 'customer_id', length: 36 })
  customerId: string;

  @Column({ name: 'card_type', type: 'enum', enum: CardType })
  cardType: CardType;

  @Column({ type: 'enum', enum: CardNetwork })
  network: CardNetwork;

  @Column({ name: 'cardholder_name', length: 100 })
  cardholderName: string;

  @Column({ name: 'expiry_month', type: 'tinyint' })
  expiryMonth: number;

  @Column({ name: 'expiry_year', type: 'smallint' })
  expiryYear: number;

  @Column({ length: 3, nullable: true })
  cvv?: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    name: 'credit_limit',
  })
  creditLimit: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    name: 'current_balance',
  })
  currentBalance: number;

  @Column({ type: 'enum', enum: CardStatus, default: CardStatus.ACTIVE })
  status: CardStatus;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 50000,
    name: 'daily_limit',
  })
  dailyLimit: number;

  @Column({ type: 'tinyint', default: 1, name: 'international_enabled' })
  internationalEnabled: number;

  @Column({ type: 'tinyint', default: 1, name: 'contactless_enabled' })
  contactlessEnabled: number;

  @Column({ type: 'tinyint', default: 1, name: 'otp_enabled' })
  otpEnabled: number;

  @Column({ type: 'date', nullable: true, name: 'issued_date' })
  issuedDate?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'activated_date' })
  activatedDate?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_transaction_at' })
  lastTransactionAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ✅ PERFECT Relationships
  @ManyToOne(() => BankCustomer, (customer) => customer.cards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: BankCustomer;

  @ManyToOne(() => Account, (account) => account.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];
}
