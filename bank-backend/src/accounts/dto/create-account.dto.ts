import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';
import { AccountType, AccountStatus } from '../entity/customer-account.entity';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType;

  @IsEnum(AccountStatus)
  @IsOptional()
  accountStatus?: AccountStatus = AccountStatus.ACTIVE;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  interestRate?: number = 0;

  @IsDateString()
  @IsNotEmpty()
  openedDate: string;

  @IsDateString()
  @IsOptional()
  maturityDate?: string;
}
