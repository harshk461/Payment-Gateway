import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('app_payment_transactions')
export class AppPaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'varchar' })
  orderId: string;

  @Column({ name: 'intent_id', type: 'int' })
  intentId: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ name: 'client_secret', type: 'varchar' })
  clientSecret: string;

  @Column({ name: 'idempotency_key', type: 'varchar' })
  idempotencyKey: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  event: string;

  @Column({ name: 'provider_reference', type: 'varchar' })
  providerReference: string;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
