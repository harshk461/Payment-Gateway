import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AuthorizationStatus {
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  REVERSED = 'REVERSED',
  EXPIRED = 'EXPIRED',
}

@Entity('bank_authorizations')
export class Authorization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'card_id' })
  cardId: string;

  @Index()
  @Column({ name: 'account_id' })
  accountId: string;

  @Index()
  @Column({ name: 'merchant_id' })
  merchantId: string;

  @Index()
  @Column({ name: 'order_id' })
  orderId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: AuthorizationStatus,
    default: AuthorizationStatus.AUTHORIZED,
  })
  status: AuthorizationStatus;

  @Column({ name: 'captured_at', nullable: true })
  capturedAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
