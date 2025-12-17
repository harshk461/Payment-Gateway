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
import { AppOrderPayment } from './order-payment.entity';

@Entity('app_payment_status')
export class AppPaymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id', type: 'int' })
  paymentId: number;

  @ManyToOne(() => AppOrderPayment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: AppOrderPayment;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'json', nullable: true })
  payload?: Record<string, any>;

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
