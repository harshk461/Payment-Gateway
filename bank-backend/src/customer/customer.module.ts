import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankCustomer } from './entity/customer.entity';
import { BankCustomerAddress } from './entity/customer-address.entity';
import { Account } from 'src/accounts/entity/customer-account.entity';
import { Card } from 'src/card/entity/card.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Branch } from 'src/accounts/entity/branch.entity';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    TypeOrmModule.forFeature([
      BankCustomer,
      BankCustomerAddress,
      Account,
      Card,
      Transaction,
      Branch,
    ]),
  ],
})
export class CustomerModule {}
