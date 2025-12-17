import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from './entities/users.entity';
import { JwtCustomModule } from 'src/jwt/jwt.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([AppUser]), JwtCustomModule],
})
export class UsersModule {}
