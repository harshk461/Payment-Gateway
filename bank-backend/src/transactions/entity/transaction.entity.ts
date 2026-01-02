import { Account } from 'src/accounts/entity/customer-account.entity';
import { Card } from 'src/card/entity/card.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  FEE = 'fee',
  INTEREST = 'interest',
  ADJUSTMENT = 'adjustment',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
  HOLD = 'hold',
}

export enum PaymentMethod {
  UPI = 'UPI',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  IMPS = 'IMPS',
  CARD = 'CARD',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  INTERNAL = 'INTERNAL',
}

@Entity('bank_transactions')
@Index('IDX_transactions_account_id', ['accountId'])
@Index('IDX_transactions_customer_id', ['customerId'])
@Index('IDX_transactions_card_id', ['cardId'])
@Index('IDX_transactions_status', ['status'])
@Index('IDX_transactions_date', ['processedAt'])
@Index('IDX_transactions_customer_date', ['customerId', 'processedAt'])
@Index('IDX_transactions_type_status', ['type', 'status'])
@Index('IDX_transactions_reference', ['txnReference'])
export class Transaction {
  @PrimaryColumn({ length: 20 })
  id: string;

  @Column({ length: 50, unique: true })
  txnReference: string;

  @Column({ name: 'account_id', length: 20 })
  accountId: string;

  @Column({ name: 'customer_id', length: 20 })
  customerId: string;

  @Column({ name: 'card_id', length: 20, nullable: true })
  cardId?: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  balanceBefore: number;

  @Column('decimal', { precision: 15, scale: 2 })
  balanceAfter: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 50, nullable: true })
  category?: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ length: 100, nullable: true })
  sourceReference?: string;

  @Column({ length: 50, nullable: true })
  sourceBank?: string;

  @Column({ length: 20, nullable: true })
  sourceIfsc?: string;

  @Column({ length: 20, nullable: true })
  destinationAccount?: string;

  @Column({ length: 20, nullable: true })
  destinationIfsc?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  transactionFee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  gstAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  initiatedAt?: Date;

  @Column({
    name: 'processed_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ✅ FIXED Relationships - All column names match
  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => BankCustomer, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: BankCustomer;

  @ManyToOne(() => Card, (card) => card.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'card_id' })
  card?: Card;
}
