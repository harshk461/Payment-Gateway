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
import { AppOrder } from './order.entity';
import { AppProduct } from './products.entity';

@Entity('app_order_items')
export class AppOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'varchar' })
  orderId: string;

  @ManyToOne(() => AppOrder, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: AppOrder;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => AppProduct, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: AppProduct;

  @Column({ name: 'per_price', type: 'int' })
  perPrice: number;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'int' })
  quantity: number;

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
