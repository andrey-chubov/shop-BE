import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WRONG_AMOUNT_PRODUCTS } from '../../shared/errors/errorMessages';
import { CartType } from '../../shared/types/cartType';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../product/products.service';
import { UsersService } from '../users/users.service';
import { GetOrdersDto } from './dto/getOrders.dto';
import { OrdersDocument } from './model/orders-model';
import { OrdersRepository } from './orders.repository';
import { IProduct } from '../product/interfaces/product.interface';
import { IUser } from '../users/interfaces/user.interface';
import config from '../../config';

@Injectable()
export class OrdersService {
  private logger = new Logger('OrdersService');

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly cartsService: CartsService,
  ) {}

  async createOrder(id: string, address: string): Promise<OrdersDocument> {
    const user = await this.usersService.findUserById(id);
    const carts = user.carts.map(item => {
      return { ...item, productId: item.productId._id };
    });
    await this.validateAmountProducts(user);
    await this.decrementAmountProducts(user);
    const quantityOrder = user.carts.reduce((total, p) => {
      return (total += p.amount);
    }, 0);
    const orderPrice = user.carts.reduce((total, p) => {
      return (total += p.amount * p.cost);
    }, 0);
    this.logger.log(
      `${user.email} create order for products: ${carts
        .map(item => {
          return item.productId.toString();
        })
        .toString()}`,
    );
    await this.cartsService.clearCart(id);
    return await this.ordersRepository.create(
      id,
      carts,
      quantityOrder,
      orderPrice,
      address,
    );
  }

  async getUserOrders(
    id: string,
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
  ): Promise<GetOrdersDto> {
    return await this.ordersRepository.findByUserId(id, limit, page);
  }

  async getAllOrders(
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
  ): Promise<GetOrdersDto> {
    return await this.ordersRepository.find(limit, page);
  }

  assertProductEnough(orderProduct: CartType, product: IProduct): void {
    if (orderProduct.amount > product.amount || orderProduct.amount <= 0)
      throw new BadRequestException(WRONG_AMOUNT_PRODUCTS);
  }

  async validateAmountProducts(user: IUser): Promise<void> {
    for (const orderProduct of user.carts) {
      const product = await this.productsService.getProductById(
        orderProduct.productId._id.toString(),
      );
      this.assertProductEnough(orderProduct, product);
    }
  }

  async decrementAmountProducts(user: IUser): Promise<void> {
    for (const orderProduct of user.carts) {
      const product = await this.productsService.getProductById(
        orderProduct.productId._id.toString(),
      );
      product.amount = product.amount - orderProduct.amount;
      await this.productsService.updateProduct(product._id.toString(), product);
    }
  }
}
