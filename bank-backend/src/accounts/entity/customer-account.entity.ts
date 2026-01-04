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
import { Branch } from './branch.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Card } from 'src/card/entity/card.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  PREMIUM_SAVINGS = 'premium_savings',
  FIXED_DEPOSIT = 'fixed_deposit',
}

export enum AccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
  DORMANT = 'dormant',
}

@Entity('bank_customer_accounts')
@Index('IDX_accounts_account_number', ['accountNumber'], { unique: true })
@Index('IDX_accounts_customer_id', ['customerId'])
@Index('IDX_accounts_branch_id', ['branchId'])
@Index('IDX_accounts_status', ['accountStatus'])
@Index('IDX_accounts_balance', ['balance'])
@Index('IDX_accounts_customer_status', ['customerId', 'accountStatus'])
@Index('IDX_accounts_branch_status', ['branchId', 'accountStatus'])
export class Account {
  @PrimaryColumn({ length: 20 })
  id: string;

  @Column({ name: 'account_number', length: 20, unique: true })
  accountNumber: string;

  // ✅ FIXED: Added explicit column name for foreign key
  @Column({ name: 'branch_id', length: 10 })
  branchId: string;

  @Column({ name: 'cif_number', length: 36 })
  cifNumber: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    name: 'account_type',
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
    name: 'account_status',
  })
  accountStatus: AccountStatus;

  @Column({ type: 'int' })
  balance: number;

  @Column('int', {
    default: 0,
    name: 'blocked_amount',
  })
  blockedAmount: number;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    default: 0,
    name: 'interest_rate',
  })
  interestRate: number;

  @Column({ type: 'date', name: 'opened_date' })
  openedDate: string;

  @Column({ type: 'date', nullable: true, name: 'maturity_date' })
  maturityDate?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // @DeleteDateColumn({ name: 'deleted_at' })
  // deletedAt?: Date;

  @Column({ name: 'customer_id', length: 20 })
  customerId: string;

  @ManyToOne(() => BankCustomer, (customer) => customer.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' }) // ✅ Matches BankCustomer column
  customer: BankCustomer;

  @ManyToOne(() => Branch, (branch) => branch.accounts)
  @JoinColumn({ name: 'branch_id' }) // ✅ Matches the column name
  branch: Branch;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
