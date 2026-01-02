import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BankCustomerAddress } from './customer-address.entity';
import { Branch } from 'src/accounts/entity/branch.entity';
import { Account } from 'src/accounts/entity/customer-account.entity'; // ✅ Fixed import path
import { Card } from 'src/card/entity/card.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';

@Entity({ name: 'bank_customers' })
@Index('IDX_BANK_CUSTOMERS_EMAIL', ['email'])
@Index('IDX_BANK_CUSTOMERS_PHONE', ['phone'])
@Index('IDX_BANK_CUSTOMERS_BRANCH', ['branchId'])
@Index('IDX_BANK_CUSTOMERS_KYC_STATUS', ['kycStatus'])
export class BankCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'varchar', length: 20, unique: true })
  customerId: string; // CUST001 format

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({
    name: 'kyc_status',
    type: 'enum',
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  })
  kycStatus: 'pending' | 'verified' | 'rejected';

  // ✅ FIXED: Explicit column name for foreign key
  @Column({ type: 'varchar', length: 10, name: 'branch_id' })
  branchId: string;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;

  @ManyToOne(() => Branch, (branch) => branch.customers, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'branch_id' }) // ✅ Matches column name exactly
  branch: Branch;

  @OneToMany(() => Account, (account) => account.customer) // ✅ Matches Account's ManyToOne
  accounts: Account[];

  @OneToMany(() => Card, (card) => card.customer) // ✅ Matches Card's ManyToOne
  cards: Card[];

  @OneToMany(() => BankCustomerAddress, (address) => address.customer)
  addresses: BankCustomerAddress[];

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Transaction[];
}
