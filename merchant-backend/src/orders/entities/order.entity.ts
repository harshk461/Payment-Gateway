import { AppUser } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('app_orders')
export class AppOrder {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => AppUser, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: AppUser;

  @Column({ name: 'cart_id', type: 'varchar' })
  cartId: string;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @Column({ name: 'ip_info', type: 'json', nullable: true })
  ipInfo?: Record<string, any>;

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
