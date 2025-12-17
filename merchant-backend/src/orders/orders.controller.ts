import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('products')
  getAllProducts() {
    return this.ordersService.getAllProducts();
  }

  @Get('products/:slug')
  getProductDetailBySlug(@Param('slug') slug: string) {
    return this.ordersService.getProductDetailBySlug(slug);
  }

  @UseGuards(AuthGuard)
  @Post('add-to-cart')
  addToCart(@Req() req: any, @Body() dto: any) {
    return this.ordersService.addToCart(req?.user?.userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('cart')
  getUserCart(@Req() req: any) {
    return this.ordersService.getUserCart(req?.user?.id);
  }

  @UseGuards(AuthGuard)
  @Put('cart/remove')
  removeProductFromCart(@Req() req: any, @Body() dto: any) {
    return this.ordersService.removeProductFromCart(req?.user?.userId, dto);
  }

  @UseGuards(AuthGuard)
  @Put('cart/quantity')
  updateProductQuantity(@Req() req: any, @Body() dto: any) {
    return this.ordersService.updateProductQuantity(req?.user?.userId, dto);
  }

  @UseGuards(AuthGuard)
  @Post()
  placeOrder(@Req() req: any) {
    const ipInfo = this.extractIpInfo(req);
    return this.ordersService.placeOrder(req?.user?.userId, ipInfo);
  }

  private extractIpInfo(req: any) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.socket.remoteAddress;

    return {
      ip,
      userAgent: req.headers['user-agent'],
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  getOrders(@Req() req: any) {
    return this.ordersService.getOrders(req?.user?.userId);
  }
}
