import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceCustom {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Create JWT token
   */
  createToken(payload: { userId: number; phoneNumber: string }): string {
    return this.jwtService.sign(payload);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
