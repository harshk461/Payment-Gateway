import { IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  mobile: string;

  @IsString()
  @Length(4, 6)
  otp: string;
}
