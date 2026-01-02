// cards/dto/create-card.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { CardType, CardNetwork } from '../entity/card.entity';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsEnum(CardType)
  @IsNotEmpty()
  cardType: CardType;

  @IsEnum(CardNetwork)
  @IsNotEmpty()
  network: CardNetwork;

  @IsString()
  @IsNotEmpty()
  cardholderName: string;

  @IsNumber()
  @Min(1000)
  @Max(500000)
  @IsOptional()
  dailyLimit?: number = 50000;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  internationalEnabled?: number = 1;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  contactlessEnabled?: number = 1;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  otpEnabled?: number = 1;
}
