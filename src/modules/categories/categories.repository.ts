import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoriesDto } from './dto/createCategories.dto';
import { Categories, CategoriesDocument } from './model/categories-model';
import { UpdateCategoriesDto } from './dto/updateCategories.dto';
import { UPDATE_ERROR } from '../../shared/errors/errorMessages';
import { ProductsService } from '../product/products.service';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Categories.name)
    private categoriesModel: Model<CategoriesDocument>,
    private productsService: ProductsService,
  ) {}

  async create(
    createCategoriesDto: CreateCategoriesDto,
  ): Promise<CategoriesDocument> {
    return this.categoriesModel.create(createCategoriesDto);
  }

  async find(): Promise<CategoriesDocument[]> {
    return this.categoriesModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<CategoriesDocument> {
    return this.categoriesModel.findById(id);
  }

  async updateById(
    id: string,
    updatedCategories: UpdateCategoriesDto,
  ): Promise<CategoriesDocument> {
    const productsInCategory =
      await this.productsService.getAmountProductsInCategory(id);

    this.assertProductsExists(productsInCategory);

    return this.categoriesModel
      .findByIdAndUpdate(id, updatedCategories, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<CategoriesDocument> {
    const productsInCategory =
      await this.productsService.getAmountProductsInCategory(id);

    this.assertProductsExists(productsInCategory);

    return this.categoriesModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }

  assertProductsExists(count: number): void {
    if (count > 0) {
      throw new BadRequestException(UPDATE_ERROR);
    }
  }
}
