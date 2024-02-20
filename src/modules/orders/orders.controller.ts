import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserValidationPipes } from '../../pipes/userValidation.pipe';
import { AccessAuthGuard } from '../authentication/guards/accessAuth.guard';
import { GetOrdersParamsDto } from './dto/getOrdersParams.dto';
import { OrdersDocument } from './model/orders-model';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UsePipes(UserValidationPipes)
  @UseGuards(AccessAuthGuard)
  @Post()
  async createOrder(@Query() query, @Req() req): Promise<OrdersDocument> {
    return await this.ordersService.createOrder(req.user.id, query.adress);
  }

  @UseGuards(AccessAuthGuard)
  @Get()
  async getUserOrders(@Req() req, @Query() queryParams: GetOrdersParamsDto) {
    return await this.ordersService.getUserOrders(
      req.user.id,
      queryParams.limit,
      queryParams.page,
    );
  }

  @UseGuards(AccessAuthGuard)
  @Get('all')
  async getAllOrders(@Query() queryParams: GetOrdersParamsDto) {
    return await this.ordersService.getAllOrders(
      queryParams.limit,
      queryParams.page,
    );
  }
}
