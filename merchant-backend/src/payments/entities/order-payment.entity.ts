import { AppOrder } from 'src/orders/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('app_order_payments')
export class AppOrderPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'varchar' })
  orderId: string;

  @ManyToOne(() => AppOrder, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: AppOrder;

  @Column({ name: 'actual_amount', type: 'int' })
  actualAmount: number;

  @Column({ name: 'left_amount', type: 'int' })
  leftAmount: number;

  @Column({ name: 'amount_paid', type: 'int' })
  amountPaid: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ name: 'payment_method', type: 'varchar', nullable: true })
  paymentMethod?: string;

  @Column({ name: 'provider_payment_id', type: 'varchar', nullable: true })
  providerPaymentId?: string;

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
