import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BankCustomer } from './customer.entity';

@Entity({ name: 'bank_customer_addresses' })
@Index('IDX_ADDRESS_CUSTOMER', ['customerId'])
export class BankCustomerAddress {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    name: 'customer_id',
    type: 'char',
    length: 36,
  })
  customerId: string;

  @ManyToOne(() => BankCustomer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: BankCustomer;

  @Column({
    name: 'address_line_1',
    type: 'varchar',
    length: 255,
  })
  addressLine1: string;

  @Column({
    name: 'address_line_2',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressLine2?: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  state: string;

  @Column({
    name: 'pin_code',
    type: 'varchar',
    length: 20,
  })
  pinCode: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'IN',
  })
  country: string;

  @Column({
    name: 'is_active',
    type: 'tinyint',
    default: () => '1',
  })
  isActive: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
  })
  status: string;

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
  deletedAt?: Date;
}
