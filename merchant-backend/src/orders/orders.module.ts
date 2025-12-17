import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCart } from './entities/cart.entity';
import { AppCartItem } from './entities/cart-items.entity';
import { AppOrder } from './entities/order.entity';
import { AppOrderItem } from './entities/order-item.entity';
import { AppOrderPayment } from 'src/payments/entities/order-payment.entity';
import { AppPaymentStatus } from 'src/payments/entities/payment-status.entity';
import { AppProduct } from './entities/products.entity';
import { JwtCustomModule } from 'src/jwt/jwt.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([
      AppCart,
      AppCartItem,
      AppOrder,
      AppOrderItem,
      AppOrderPayment,
      AppPaymentStatus,
      AppProduct,
    ]),
    JwtCustomModule,
  ],
})
export class OrdersModule {}
