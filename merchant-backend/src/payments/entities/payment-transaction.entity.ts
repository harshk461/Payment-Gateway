import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('app_payment_transactions')
@Index('IDX_TXN_INTENT_ID', ['intentId'])
export class AppPaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  // ---------------- RELATION ----------------

  @Column({ name: 'intent_id', type: 'int' })
  intentId: number;

  // ---------------- AMOUNT ----------------

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  // ---------------- PROCESSING ----------------

  @Column({ type: 'varchar' })
  status: string; // PENDING | SUCCESS | FAILED

  @Column({ name: 'attempt_no', type: 'int' })
  attemptNo: number;

  @Column({ type: 'varchar' })
  connector: string; // dummy / stripe / razorpay

  // ---------------- PAYMENT METHOD ----------------

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod: string; // CARD | UPI | WALLET | NET_BANKING

  @Column({ name: 'card_network', type: 'varchar', nullable: true })
  cardNetwork?: string;

  @Column({ name: 'upi_app', type: 'varchar', nullable: true })
  upiApp?: string;

  @Column({ name: 'wallet_provider', type: 'varchar', nullable: true })
  walletProvider?: string;

  @Column({ name: 'bank_code', type: 'varchar', nullable: true })
  bankCode?: string;

  // ---------------- RESULT ----------------

  @Column({ name: 'provider_reference', type: 'varchar', nullable: true })
  providerReference?: string;

  @Column({ name: 'failure_reason', type: 'varchar', nullable: true })
  failureReason?: string;

  // ---------------- RAW RESPONSE ----------------

  @Column({ name: 'response_payload', type: 'json', nullable: true })
  responsePayload?: any;

  // ---------------- TIMESTAMPS ----------------

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
