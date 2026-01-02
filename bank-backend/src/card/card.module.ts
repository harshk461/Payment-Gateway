import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entity/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [TypeOrmModule.forFeature([Card, Account, BankCustomer])],
})
export class CardModule {}
