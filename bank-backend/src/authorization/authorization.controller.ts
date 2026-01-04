import { Body, Controller, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CapturePaymentDto } from './dto/capture-payment.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('authorize')
  async authorizePayment(@Body() body: any) {
    return this.authorizationService.authorizePayment(body);
  }

  @Post('capture')
  async capturePayment(@Body() body: CapturePaymentDto) {
    return this.authorizationService.capturePayment(body);
  }
}
