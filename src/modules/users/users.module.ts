import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user-model';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CartsService } from '../carts/carts.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ProductsModule } from '../product/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProductsModule,
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, FavoritesService, CartsService],
  exports: [UsersService],
})
export class UsersModule {}
