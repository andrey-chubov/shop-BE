import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './model/products-model';
import { ProductsRepository } from './products.repository';
import { FilesService } from '../../modules/files/file.service';
import { MulterModule } from '@nestjs/platform-express';
import config from '../../config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
    ]),
    MulterModule.register({
      dest: config.pathToMulter,
    }),
  ],
  providers: [ProductsRepository, ProductsService, FilesService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
