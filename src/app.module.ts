import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/product/products.module';
import { FilesModule } from './modules/files/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CartsModule } from './modules/carts/carts.module';
import { OrdersModule } from './modules/orders/orders.module';
import config from './config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot(config.host),
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    ProductsModule,
    FilesModule,
    FavoritesModule,
    CartsModule,
    OrdersModule,
  ],
})
export class AppModule {}
