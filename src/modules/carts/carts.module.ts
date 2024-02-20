import { Module } from '@nestjs/common';
import { ProductsModule } from '../product/products.module';
import { UsersModule } from '../users/users.module';
import { CartsService } from './carts.service';

@Module({
  imports: [UsersModule, ProductsModule],
  exports: [CartsService],
  providers: [CartsService],
})
export class CartsModule {}
