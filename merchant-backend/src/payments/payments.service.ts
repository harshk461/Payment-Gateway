import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppOrderPayment } from './entities/order-payment.entity';
import { Repository } from 'typeorm';
import { AppPaymentStatus } from './entities/payment-status.entity';
import { AppPaymentTransaction } from './entities/payment-transaction.entity';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(AppOrderPayment)
    private appOrderPaymentRepository: Repository<AppOrderPayment>,
    @InjectRepository(AppPaymentStatus)
    private appPaymentStatusRepository: Repository<AppPaymentStatus>,
    @InjectRepository(AppPaymentTransaction)
    private appPaymentTransactionRepository: Repository<AppPaymentTransaction>,
  ) {}

  async createOrderPayment(userId: number, dto: any) {
    try {
      // 1️⃣ Validate order
      const order = await this.appOrderPaymentRepository.findOne({
        where: {
          orderId: dto.orderId,
        },
      });

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      const validStatus = ['PENDING', 'PARTIAL_PAID'];
      if (!validStatus.includes(order.status)) {
        throw new HttpException(
          'Order is not eligible for payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2️⃣ Idempotency protection
      const existingTxn = await this.appPaymentTransactionRepository.findOne({
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existingTxn) {
        return {
          clientSecret: existingTxn.clientSecret,
          intentId: existingTxn.intentId,
        };
      }

      // 3️⃣ Create payment intent (external call)
      const intentPayload = {
        amount: dto.amount * 100, //paise
        currency: dto.currency,
        idempotencyKey: dto.idempotencyKey,
        metadata: JSON.stringify({
          orderId: dto.orderId,
          userId,
        }),
      };

      const response = await axios.post(
        `${process.env.FLOWPAY_BACKEND_API_URL}/payment/create`,
        intentPayload,
        {
          headers: {
            Authorization: `Basic ${process.env.FLOWPAY_SECRET_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': dto.idempotencyKey,
          },
          timeout: 10000,
        },
      );

      const {
        intentId,
        clientSecret,
        amount: intentAmount,
        currency: intentCurrency,
        providerReference = '',
      } = response.data;

      // 4️⃣ Save transaction
    //   await this.appPaymentTransactionRepository.save({
    //     orderId: dto.orderId,
    //     intentId,
    //     amount: dto.amount,
    //     currency: dto.currency,
    //     clientSecret,
    //     idempotencyKey: dto.idempotencyKey,
    //     status: 'CREATED',
    //     providerReference,
    //     paymentMethod: 'FLOWPAY',
    //   });
      // 5️⃣ Return minimal safe response
      return {
        orderId: dto.orderId,
        intentId,
        clientSecret,
        amount: intentAmount,
        currency: intentCurrency,
      };
    } catch (err: any) {
      console.error('Error creating order payment:', err);

      if (err.response) {
        throw new HttpException(
          err.response.data?.message || 'Payment gateway error',
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        'Error creating order payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async paymentWebhook(dto: any) {
    try {
      console.log('--=====WebHook Body-====--=-', dto);
      const { event, data, metadata } = dto;

      const parsedMetadata = JSON.parse(metadata);

      const orderPayment = await this.appOrderPaymentRepository.findOne({
        where: {
          orderId: parsedMetadata.orderId,
        },
      });

      if (!orderPayment) {
        throw new HttpException(
          "Order Payment Doesn't Exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPaymentTransaction = {
        orderId: orderPayment.orderId,
        intentId: data.intentId,
        amount: data.amount,
        currency: data.currency,
        idempotencyKey: data.idempotencyKey,
        status: data.status,
        event,
        providerReference: data.providerReference || '',
        paymentMethod: 'Flowpay',
        clientSecret: data.clientSecret || '',
      };

      await this.appPaymentTransactionRepository.save(newPaymentTransaction);

      if (event.split('.')[1] == 'success') {
        await this.appOrderPaymentRepository.update(
          {
            orderId: orderPayment.orderId,
          },
          {
            amountPaid: orderPayment.amountPaid + Number(data.amount / 100),
            leftAmount: orderPayment.leftAmount - Number(data.amount / 100),
            status: 'PAID',
            paymentMethod: 'Flowpay',
            providerPaymentId: data.providerReference,
          },
        );
      }

      return { message: 'success' };
    } catch (err) {
      console.log('Payment Webhook Error', err);
    }
  }
}
