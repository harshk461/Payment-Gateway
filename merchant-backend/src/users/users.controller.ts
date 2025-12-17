import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.usersService.sendOtp(dto.mobile);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.usersService.verifyOtp(dto.mobile, dto.otp);
  }

  @Get('me')
  getProfile(@Req() req: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.usersService.getProfile(token);
  }
}
