import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppOrderPayment } from './entities/order-payment.entity';
import { Repository } from 'typeorm';
import { AppPaymentStatus } from './entities/payment-status.entity';
import { AppPaymentTransaction } from './entities/payment-transaction.entity';
import axios from 'axios';
import { AppWebhookEvent } from './entities/webhook-event.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(AppOrderPayment)
    private appOrderPaymentRepository: Repository<AppOrderPayment>,
    @InjectRepository(AppPaymentStatus)
    private appPaymentStatusRepository: Repository<AppPaymentStatus>,
    @InjectRepository(AppPaymentTransaction)
    private appPaymentTransactionRepository: Repository<AppPaymentTransaction>,
    @InjectRepository(AppWebhookEvent)
    private appWebhookEventRepository: Repository<AppWebhookEvent>,
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
    const endpoint = '/webhooks/payment';

    try {
      console.log('----=======Webhook body--=-===-=-=',dto)
      const { id, event, data, metadata } = dto;

      if (!id || !event) {
        throw new HttpException(
          'Invalid webhook payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // -------------------------------
      // 1. Store webhook event FIRST
      // -------------------------------
      const existingEvent = await this.appWebhookEventRepository.findOne({
        where: { id },
      });

      if (existingEvent) {
        // Idempotent handling
        return { received: true };
      }

      const webhookEvent = this.appWebhookEventRepository.create({
        id,
        merchantId: data?.attributes.merchantId ?? 0,
        event,
        payload: dto,
        endpoint,
        status: 'RECEIVED',
        attempts: 1,
      });

      await this.appWebhookEventRepository.save(webhookEvent);

      // -------------------------------
      // 2. Business processing
      // -------------------------------
      if (!metadata?.orderId) {
        throw new Error('Missing orderId in metadata');
      }

      const orderPayment = await this.appOrderPaymentRepository.findOne({
        where: { orderId: metadata.orderId },
      });

      if (!orderPayment) {
        throw new Error("Order Payment Doesn't Exist");
      }

      // -------------------------------
      // 3. Save payment transaction
      // -------------------------------
      await this.appPaymentTransactionRepository.save({
        intentId: data?.attributes?.intentId,
        amount: data?.attributes?.amount,
        currency: data?.attributes?.currency,
        status: data?.attributes?.status,
        providerReference: data?.attributes?.providerReference ?? null,
        paymentMethod: data?.attributes?.paymentMethod ?? 'UNKNOWN',
        responsePayload: dto,
        attemptNo: 1,
        connector: 'dummy',
      });

      // -------------------------------
      // 4. Update order payment
      // -------------------------------
      if (event === 'payment_intent.succeeded') {
        await this.appOrderPaymentRepository.update(
          { orderId: orderPayment.orderId },
          {
            amountPaid: orderPayment.actualAmount,
            leftAmount: 0,
            status: 'PAID',
            paymentMethod: data?.attributes?.paymentMethod,
            providerPaymentId: data?.attributes?.providerReference,
          },
        );
      }

      if (event === 'payment_intent.failed') {
        await this.appOrderPaymentRepository.update(
          { orderId: orderPayment.orderId },
          {
            status: 'FAILED',
          },
        );
      }

      // -------------------------------
      // 5. Mark webhook processed
      // -------------------------------
      await this.appWebhookEventRepository.update(
        { id },
        { status: 'PROCESSED' },
      );

      return { received: true };
    } catch (err: any) {
      console.error('Payment Webhook Error', err);

      if (dto?.id) {
        await this.appWebhookEventRepository.update(
          { id: dto.id },
          {
            status: 'FAILED',
          },
        );
      }

      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
