import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('create-order')
  createOrderPayment(@Req() req: any, @Body() dto: any) {
    return this.paymentsService.createOrderPayment(req?.user?.userId, dto);
  }

  @Post('webhook')
  paymentWebhook(@Body() dto: any) {
    return this.paymentsService.paymentWebhook(dto);
  }
}
