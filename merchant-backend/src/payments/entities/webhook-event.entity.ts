import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('app_webhook_events')
export class AppWebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string; // evt_xxx

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column()
  event: string;

  @Column({ type: 'json' })
  payload: any;

  @Column()
  endpoint: string;

  @Column()
  status: string; // RECEIVED | PROCESSED | FAILED

  @Column({ default: 0 })
  attempts: number;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
