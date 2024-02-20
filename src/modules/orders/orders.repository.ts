import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WRONG_PAGE } from '../../shared/errors/errorMessages';
import { CartType } from '../../shared/types/cartType';
import { GetOrdersDto } from './dto/getOrders.dto';
import { Orders, OrdersDocument } from './model/orders-model';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Model<OrdersDocument>,
  ) {}
  async create(
    id: string,
    carts: CartType[],
    quantity: number,
    costOrder: number,
    adress: string,
  ): Promise<OrdersDocument> {
    return await this.ordersModel.create({
      carts,
      userId: id,
      quantity,
      costOrder,
      adress,
    });
  }

  async findByUserId(
    id: string,
    limit: number,
    page: number,
  ): Promise<GetOrdersDto> {
    const lengthArray = await this.ordersModel.find({ userId: id }).count();

    if (page > Math.ceil(lengthArray / limit) && lengthArray > 0) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const ordersArray = await this.ordersModel
      .find({ userId: id })
      .populate('userId')
      .populate('carts.productId')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      ordersArray: ordersArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }

  async find(limit: number, page: number): Promise<GetOrdersDto> {
    const lengthArray = await this.ordersModel.count();

    if (page > Math.ceil(lengthArray / limit) && lengthArray > 0) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const ordersArray = await this.ordersModel
      .find()
      .populate('userId')
      .populate('carts.productId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .exec();

    return {
      ordersArray: ordersArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }
}
