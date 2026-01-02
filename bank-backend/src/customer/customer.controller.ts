import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerWithAddressDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  createNewCustomer(@Body() dto: CreateCustomerWithAddressDto) {
    return this.customerService.createNewCustomer(dto);
  }

  @Get()
  getCustomers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.customerService.getAllCustomers(limit, page);
  }

  @Get(':id')
  getCustomer(@Param('id') id: string) {
    return this.customerService.getCustomer(id);
  }
}
