import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppCart } from './entities/cart.entity';
import { DataSource, In, Repository } from 'typeorm';
import { AppCartItem } from './entities/cart-items.entity';
import { AppOrder } from './entities/order.entity';
import { AppOrderItem } from './entities/order-item.entity';
import { AppPaymentStatus } from 'src/payments/entities/payment-status.entity';
import { AppOrderPayment } from 'src/payments/entities/order-payment.entity';
import { AppProduct } from './entities/products.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(AppCart)
    private appCartRepository: Repository<AppCart>,
    @InjectRepository(AppCartItem)
    private appCartItemRepository: Repository<AppCartItem>,
    @InjectRepository(AppOrder)
    private appOrderRepository: Repository<AppOrder>,
    @InjectRepository(AppOrderItem)
    private appOrderItemRepository: Repository<AppOrderItem>,
    @InjectRepository(AppOrderPayment)
    private appOrderPaymentRepository: Repository<AppOrderPayment>,
    @InjectRepository(AppPaymentStatus)
    private appPaymentStatusRepository: Repository<AppPaymentStatus>,
    @InjectRepository(AppProduct)
    private appProductRepository: Repository<AppProduct>,
  ) {}

  async getAllProducts() {
    try {
      const products = await this.appProductRepository.find();

      return products;
    } catch (err: any) {
      console.log('Error Fetching Products!!!', err);
      throw new HttpException(
        'Error Fetching products!!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProductDetailBySlug(slug: string) {
    try {
      const product = await this.appProductRepository.findOne({
        where: {
          slug,
        },
      });

      if (!product) {
        throw new HttpException(
          "Product Doesn't exist for this slug",
          HttpStatus.BAD_REQUEST,
        );
      }

      return product;
    } catch (err: any) {
      console.log('Error Fetching Product detail by slug', err);
      throw new HttpException(
        'Error Fetching products details!!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserCart(userId: any) {
    try {
      const cart = await this.appCartRepository.findOne({
        where: {
          userId,
          isPurchased: false,
        },
      });

      if (!cart) {
        return {
          cartId: null,
          cartItems: [],
          cartTotal: 0,
        };
      }

      const cartItems = await this.appCartItemRepository
        .createQueryBuilder('aci')
        .select([
          'aci.cart_id as cartId',
          'aci.id as cartItemId',
          'aci.product_id as productId',
          'ap.name as productName',
          'ap.image_url as imageUrl',
          'ap.price as productPrice',
          'aci.total as productTotal',
          'aci.quantity as quantity',
        ])
        .leftJoin('app_products', 'ap', 'ap.id=aci.product_id')
        .where(`aci.cart_id = '${cart.id}'`)
        .getRawMany();

      return {
        cartId: cart.id,
        cartItems: cartItems,
        cartTotal: cart.total,
      };
    } catch (err) {
      console.log('Error Fetching User Cart ERR!!!', err);
      throw new HttpException(
        'Error Fetching User Cart ERR!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addToCart(userId: number, dto: any) {
    const product = await this.appProductRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    let cart = await this.appCartRepository.findOne({
      where: {
        userId,
        isPurchased: false,
      },
    });

    const productTotal = dto.quantity * product.price;

    // 🟢 CART EXISTS
    if (cart) {
      const cartItem = await this.appCartItemRepository.findOne({
        where: {
          cartId: cart.id,
          productId: dto.productId,
        },
      });

      // 🔁 PRODUCT ALREADY IN CART
      if (cartItem) {
        const oldTotal = cartItem.quantity * product.price;
        const newQuantity = cartItem.quantity + dto.quantity;
        const newTotal = newQuantity * product.price;

        await this.appCartItemRepository.update(
          { id: cartItem.id },
          { quantity: newQuantity, total: newTotal },
        );

        const newCartTotal = cart.total - oldTotal + newTotal;

        await this.appCartRepository.update(
          { id: cart.id },
          { total: newCartTotal },
        );
      }
      // ➕ NEW PRODUCT
      else {
        const newCartItem = this.appCartItemRepository.create({
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          total: productTotal,
        });

        await this.appCartItemRepository.save(newCartItem);

        await this.appCartRepository.update(
          { id: cart.id },
          { total: cart.total + productTotal },
        );
      }
    }
    // 🆕 CREATE CART
    else {
      cart = await this.appCartRepository.save({
        userId,
        total: productTotal,
        isPurchased: false,
      });

      const newCartItem = this.appCartItemRepository.create({
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
        total: productTotal,
      });

      await this.appCartItemRepository.save(newCartItem);
    }

    return { message: 'Added to cart' };
  }

  async removeProductFromCart(userId: any, dto: any) {
    try {
      const cart = await this.appCartRepository.findOne({
        where: {
          userId,
          isPurchased: false,
        },
      });

      if (!cart) {
        throw new HttpException('No Cart Exists', HttpStatus.BAD_REQUEST);
      }

      const product = await this.appProductRepository.findOne({
        where: {
          id: dto.productId,
        },
      });

      if (!product) {
        throw new HttpException(
          "Product Doesn't Exists",
          HttpStatus.BAD_REQUEST,
        );
      }

      const productCartItem = await this.appCartItemRepository.findOne({
        where: {
          productId: dto.productId,
          cartId: cart.id,
        },
      });

      if (!productCartItem) {
        throw new HttpException(
          "Product Doesn't Exists in cart",
          HttpStatus.BAD_REQUEST,
        );
      }

      const productTotal = productCartItem.total;

      const newCartTotal = cart.total - productTotal;

      await this.appCartRepository.update(
        {
          id: cart.id,
        },
        {
          total: newCartTotal,
        },
      );

      await this.appCartItemRepository.delete({
        id: productCartItem.id,
      });

      return { message: 'Product removed successfully' };
    } catch (err: any) {
      console.log('Error Removing product ERR!!', err);
      throw new HttpException(
        'Error Removing Product...',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProductQuantity(userId: any, dto: any) {
    try {
      const cart = await this.appCartRepository.findOne({
        where: {
          userId,
          isPurchased: false,
        },
      });

      if (!cart) {
        throw new HttpException('No Cart Exists', HttpStatus.BAD_REQUEST);
      }

      const product = await this.appProductRepository.findOne({
        where: {
          id: dto.productId,
        },
      });

      if (!product) {
        throw new HttpException(
          "Product Doesn't Exists",
          HttpStatus.BAD_REQUEST,
        );
      }

      const productCartItem = await this.appCartItemRepository.findOne({
        where: {
          productId: dto.productId,
          cartId: cart.id,
        },
      });

      if (!productCartItem) {
        throw new HttpException(
          "Product Doesn't Exists in cart",
          HttpStatus.BAD_REQUEST,
        );
      }

      const newProductTotal = product.price * dto.quantity;
      const newCartTotal = cart.total - productCartItem.total + newProductTotal;

      await this.appCartItemRepository.update(
        { id: productCartItem.id },
        { quantity: dto.quantity, total: newProductTotal },
      );

      await this.appCartRepository.update(
        { id: cart.id },
        { total: newCartTotal },
      );

      return { message: 'Product updated successfully' };
    } catch (err: any) {
      console.log('Error Updating product quantity ERR!!', err);
      throw new HttpException(
        'Error Updating product quantity...',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async placeOrder(userId: number, ipInfo: { ip: string; userAgent: string }) {
    return this.dataSource.transaction(async (manager) => {
      // 🔒 Lock cart row to prevent race clicks
      const cart = await manager.findOne(this.appCartRepository.target, {
        where: { userId, isPurchased: false },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cart) {
        throw new HttpException('No active cart found', HttpStatus.BAD_REQUEST);
      }

      const cartItems = await manager.find(this.appCartItemRepository.target, {
        where: { cartId: cart.id },
      });

      if (!cartItems.length) {
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }

      // 🛑 Double order protection (inside transaction)
      const existingOrder = await manager.findOne(
        this.appOrderRepository.target,
        { where: { cartId: cart.id } },
      );

      if (existingOrder) {
        throw new HttpException(
          'Order already placed for this cart',
          HttpStatus.CONFLICT,
        );
      }

      // 📦 Fetch all products in ONE query
      const productIds = cartItems.map((i) => i.productId);
      const products = await manager.find(this.appProductRepository.target, {
        where: { id: In(productIds), isActive: true },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      // 🧾 Create order
      const order = await manager.save(this.appOrderRepository.target, {
        userId,
        cartId: cart.id,
        total: cart.total,
        status: 'CREATED',
        ipInfo,
      });

      // 🧺 Create order items
      for (const item of cartItems) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new HttpException(
            `Product unavailable (ID: ${item.productId})`,
            HttpStatus.BAD_REQUEST,
          );
        }

        await manager.save(this.appOrderItemRepository.target, {
          orderId: order.id,
          productId: item.productId,
          perPrice: product.price,
          total: item.total,
          quantity: item.quantity,
        });
      }

      // 💳 Create payment entry
      await manager.save(this.appOrderPaymentRepository.target, {
        orderId: order.id,
        actualAmount: order.total,
        amountPaid: 0,
        leftAmount: order.total,
        status: 'PENDING',
      });

      // ✅ Mark cart as purchased
      await manager.update(
        this.appCartRepository.target,
        { id: cart.id },
        { isPurchased: true },
      );

      return {
        message: 'Order placed successfully',
        orderId: order.id,
      };
    });
  }

  async getOrders(userId: number) {
    try {
      const orders = await this.appOrderRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });

      if (!orders.length) {
        return { orders: [] };
      }

      const orderIds = orders.map((o) => o.id);

      const [orderItems, orderPayments] = await Promise.all([
        this.appOrderItemRepository.find({
          where: { orderId: In(orderIds) },
        }),
        this.appOrderPaymentRepository.find({
          where: { orderId: In(orderIds) },
        }),
      ]);

      // 🧠 Map orderId -> items[]
      const orderItemsMap = new Map<string, any[]>();
      for (const item of orderItems) {
        if (!orderItemsMap.has(item.orderId)) {
          orderItemsMap.set(item.orderId, []);
        }
        orderItemsMap.get(item.orderId)!.push(item);
      }

      const productIds = orderItems.map((item) => item.productId);

      const products = await this.appProductRepository.find({
        where: {
          id: In(productIds),
        },
      });

      const productMap = new Map();
      for (const product of products) {
        productMap.set(product.id, product);
      }

      // 🧠 Map orderId -> payment
      const orderPaymentMap = new Map<string, any>();
      for (const payment of orderPayments) {
        orderPaymentMap.set(payment.orderId, payment);
      }

      const finalOrders = orders.map((order) => {
        const items = orderItemsMap.get(order.id) || [];
        const payment = orderPaymentMap.get(order.id);

        const modifiedItems = items.map((item) => ({
          id: item.id,
          name: productMap.get(item.productId)?.name,
          perPrice: item.perPrice,
          price: item.total,
          qty: item.quantity,
        }));

        return {
          orderId: order.id,
          date: order.createdAt,
          status: payment?.status || order.status, // ✅ SAFE
          total: order.total,
          products: modifiedItems,
        };
      });

      return { orders: finalOrders };
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw new HttpException(
        'Error fetching user orders',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
