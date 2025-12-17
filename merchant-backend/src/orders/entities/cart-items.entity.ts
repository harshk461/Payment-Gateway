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
import { AppCart } from './cart.entity';
import { AppProduct } from './products.entity';

@Entity('app_cart_items')
export class AppCartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cart_id', type: 'varchar' })
  cartId: string;

  @ManyToOne(() => AppCart, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: AppCart;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => AppProduct, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: AppProduct;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  total: number;

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
