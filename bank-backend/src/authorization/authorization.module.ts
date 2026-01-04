import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { Card } from 'src/card/entity/card.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Authorization } from './entity/authorization-record.entity';
import { TokenizationModule } from 'src/infra/tokenization/tokenization.module';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
  imports: [
    TypeOrmModule.forFeature([
      BankCustomer,
      Account,
      Card,
      Transaction,
      Authorization,
    ]),
    TokenizationModule,
  ],
})
export class AuthorizationModule {}
