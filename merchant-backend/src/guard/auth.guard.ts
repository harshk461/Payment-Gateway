import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServiceCustom } from 'src/jwt/jwt-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtServiceCustom) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    try {
      const decoded = this.jwtService.verifyToken(token);

      // attach user to request
      request.user = decoded;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
