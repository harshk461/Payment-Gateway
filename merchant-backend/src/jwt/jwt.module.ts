import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt-constant';
import { JwtServiceCustom } from './jwt-service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [JwtServiceCustom],
  exports: [JwtServiceCustom],
})
export class JwtCustomModule {}
