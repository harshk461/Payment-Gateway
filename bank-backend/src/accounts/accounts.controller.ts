import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/customer/:id')
  async getCustomerAccounts(@Param('id') id: string) {
    return this.accountsService.getCustomerAccounts(id);
  }

  @Get()
  async getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Post()
  async createAccount(@Body() body: CreateAccountDto) {
    return this.accountsService.createAccount(body);
  }
}
