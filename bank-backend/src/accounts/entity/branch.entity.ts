import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Account } from './customer-account.entity';

@Entity('bank_branches')
@Index(['ifscCode'], { unique: true })
@Index(['branchCode'], { unique: true })
export class Branch {
  @PrimaryColumn({ length: 10 })
  id: string;

  @Column({ name: 'branch_code', length: 10, unique: true })
  branchCode: string;

  @Column({ name: 'branch_name', length: 100 })
  branchName: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 50, nullable: true })
  city?: string;

  @Column({ length: 50, nullable: true })
  state?: string;

  @Column({ length: 10, nullable: true })
  pincode?: string;

  @Column({ name: 'ifsc_code', length: 20, unique: true })
  ifscCode: string;

  @Column({ name: 'manager_id', length: 20, nullable: true })
  managerId?: string;

  @Column({ name: 'contact_phone', length: 15, nullable: true })
  contactPhone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Account, (account) => account.branch, {
    cascade: true,
  })
  accounts: Account[];

  @OneToMany(() => BankCustomer, (customer) => customer.branch) // ✅ Bidirectional
  customers: BankCustomer[];
}
