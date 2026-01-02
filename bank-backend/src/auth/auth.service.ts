import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtServiceCustom } from 'src/jwt/jwt.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private appUserRepository: Repository<AuthUser>,

    private readonly jwtService: JwtServiceCustom,
  ) {}

  // ---------------- SIGNUP ----------------
  async signup(dto: SignupDto) {
    const exists = await this.appUserRepository.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.appUserRepository.create({
      email: dto.email,
      passwordHash,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: null,
    });

    await this.appUserRepository.save(user);

    return {
      message: 'Signup successful',
    };
  }

  // ---------------- LOGIN ----------------
  async login(dto: LoginDto) {
    const user = await this.appUserRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.appUserRepository.save(user);

    const token = this.jwtService.createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
