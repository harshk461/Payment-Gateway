import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TokenizationClient {
  constructor(private readonly httpService: HttpService) {}

  async resolveToken(paymentMethodToken: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.TOKENIZATION_SERVER}/resolve`, {
          paymentMethodToken,
        }),
      );

      return res.data;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'TOKENIZATION_SERVICE_UNAVAILABLE',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
