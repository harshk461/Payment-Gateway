import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/customer-account.entity';
import { Branch } from './entity/branch.entity';
import { BankCustomer } from 'src/customer/entity/customer.entity';
import { Card } from 'src/card/entity/card.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { BankCustomerAddress } from 'src/customer/entity/customer-address.entity';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Branch,
      BankCustomer,
      Card,
      Transaction,
      BankCustomerAddress,
    ]),
  ],
})
export class AccountsModule {}
