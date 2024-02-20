import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { Categories, CategoriesSchema } from './model/categories-model';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from '../../modules/files/file.service';
import config from '../../config';
import { ProductsModule } from '../product/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategoriesSchema },
    ]),
    MulterModule.register({
      dest: config.pathToMulter,
    }),
    ProductsModule,
  ],
  providers: [CategoriesRepository, CategoriesService, FilesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
