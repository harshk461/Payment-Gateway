import {
  IsString,
  IsNumber,
  IsOptional,
  Length,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class AuthorizePaymentDto {
  @IsString()
  @Length(13, 19)
  cardNumber: string;

  @IsString()
  @Length(2, 2)
  expiryMonth: string;

  @IsString()
  @Length(2, 2)
  expiryYear: string;

  @IsString()
  @Length(3, 4)
  cvv: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
