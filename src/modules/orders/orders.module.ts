import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../product/products.module';
import { UsersModule } from '../users/users.module';
import { Orders, OrdersSchema } from './model/orders-model';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    ProductsModule,
    UsersModule,
    CartsModule,
  ],
  providers: [OrdersRepository, OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
