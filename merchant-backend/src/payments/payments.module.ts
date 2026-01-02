import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppOrderPayment } from './entities/order-payment.entity';
import { AppPaymentStatus } from './entities/payment-status.entity';
import { AppPaymentTransaction } from './entities/payment-transaction.entity';
import { JwtCustomModule } from 'src/jwt/jwt.module';
import { AppWebhookEvent } from './entities/webhook-event.entity';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    TypeOrmModule.forFeature([
      AppOrderPayment,
      AppPaymentStatus,
      AppPaymentTransaction,
      AppWebhookEvent,
    ]),
    JwtCustomModule,
  ],
})
export class PaymentsModule {}
