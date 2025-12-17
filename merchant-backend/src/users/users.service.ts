import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppUser } from './entities/users.entity';
import { Repository } from 'typeorm';
import { JwtServiceCustom } from 'src/jwt/jwt-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AppUser)
    private appUserRepository: Repository<AppUser>,

    private readonly jwtService: JwtServiceCustom,
  ) {}

  private otpStore = new Map<string, string>();

  async sendOtp(mobile: string) {
    const user = await this.appUserRepository.findOne({
      where: {
        phoneNumber: mobile,
      },
    });

    if (user?.deletedAt) {
      throw new HttpException('Client is deleted', HttpStatus.BAD_REQUEST);
    }

    // const otp = this.generateOtp();
    const otp = '123456';

    this.otpStore.set(mobile, otp);

    console.log(`OTP for ${mobile}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }
  async verifyOtp(mobile: string, otp: string) {
    // const savedOtp = this.otpStore.get(mobile);

    // if (!savedOtp || savedOtp !== otp) {
    //   throw new UnauthorizedException('Invalid or expired OTP');
    // }

    if (otp != '123456') {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // OTP is valid → remove it
    this.otpStore.delete(mobile);

    // 1️⃣ Find user by phone number
    let user = await this.appUserRepository.findOne({
      where: { phoneNumber: mobile },
    });

    // 2️⃣ Create user if not exists
    if (!user) {
      user = this.appUserRepository.create({
        phoneNumber: mobile,
        isRegistered: true,
        isActive: true,
      });

      user = await this.appUserRepository.save(user);
    }

    // 3️⃣ Generate JWT
    const token = this.jwtService.createToken({
      userId: user.id,
      phoneNumber: user.phoneNumber,
    });

    // 4️⃣ Return auth response
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    };
  }

  async getProfile(token) {
    try {
      let decoded: any;

      try {
        decoded = this.jwtService.verifyToken(token);
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const user = await this.appUserRepository.findOne({
        where: { id: decoded.userId },
        select: ['id', 'phoneNumber', 'name', 'isActive'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        user,
      };
    } catch (err) {
      console.log('Get Me Error !!!', err);
      throw new HttpException('Get Profile Error!!!', HttpStatus.BAD_REQUEST);
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
