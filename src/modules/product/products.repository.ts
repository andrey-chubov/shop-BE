import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductsDto } from './dto/createProducts.dto';
import { UpdateProductsDto } from './dto/updateProducts.dto';
import { Products, ProductsDocument } from './model/products-model';
import { WRONG_PAGE } from '../../shared/errors/errorMessages';
import { GetProductsDto } from './dto/getProducts.dto';
import { FilteredProductDto } from './dto/filterAndSortProduct.dto';
import { IProduct } from './interfaces/product.interface';
import config from '../../config';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Products.name)
    private productsModel: Model<ProductsDocument>,
  ) {}

  async create(
    createProductsDto: CreateProductsDto,
  ): Promise<ProductsDocument> {
    return await this.productsModel.create(createProductsDto);
  }

  async productsCount(): Promise<number> {
    return await this.productsModel.find({ isDeleted: false }).count();
  }

  async find(limit: number, page: number): Promise<GetProductsDto> {
    const lengthArray = await this.productsCount();

    if (page > Math.ceil(lengthArray / limit)) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const productsArray = await this.productsModel
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .exec();

    return {
      productsArray: productsArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }

  async findNew(): Promise<ProductsDocument[]> {
    return this.productsModel
      .find({ isDeleted: false })
      .sort({ $natural: -1 })
      .limit(config.limitPagination)
      .exec();
  }

  async findNewByCategory(categoryId: string): Promise<ProductsDocument[]> {
    return this.productsModel
      .find({ categoryId, isDeleted: false })
      .sort({ $natural: -1 })
      .limit(config.limitPagination)
      .exec();
  }

  async findByCategory(
    limit: number,
    page: number,
    categoryId: string,
  ): Promise<GetProductsDto> {
    const lengthArray = await this.productsModel
      .find({ categoryId, isDeleted: false })
      .count();

    if (page > Math.ceil(lengthArray / limit)) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const productsArray = await this.productsModel
      .find({ categoryId, isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .exec();

    return {
      productsArray: productsArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }

  async findById(id: string): Promise<ProductsDocument> {
    return this.productsModel.findById(id);
  }

  async updateById(
    id: string,
    updatedProduct: UpdateProductsDto | IProduct,
  ): Promise<ProductsDocument> {
    return this.productsModel
      .findByIdAndUpdate(id, updatedProduct, { new: true })
      .exec();
  }

  async findSelectedId(
    id: string[],
    limit: number,
    page: number,
  ): Promise<GetProductsDto> {
    const lengthArray = await this.productsModel
      .find({
        _id: { $in: id },
        isDeleted: false,
      })
      .count();

    if (page > Math.ceil(lengthArray / limit)) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const productsArray = await this.productsModel
      .find({
        _id: { $in: id },
        isDeleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      productsArray: productsArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }

  async findByFilters(
    filterAndSortProductDto: FilteredProductDto,
    limit: number,
    page: number,
  ): Promise<GetProductsDto> {
    const {
      sortPropierty,
      categoryId,
      sortDirection,
      maxCost,
      minCost,
      searchWord,
    } = filterAndSortProductDto;
    const lengthArray = await this.productsModel
      .find(categoryId && { categoryId })
      .collation({ locale: 'en', strength: 2 })
      .find(
        searchWord && {
          ['name']: { $regex: `${searchWord}`, $options: 'i' },
        },
      )
      .find(minCost && { cost: { $gte: minCost } })
      .find(maxCost && { cost: { $lte: maxCost } })
      .sort({ [sortPropierty]: sortDirection, name: 1 })
      .count();

    if (page > Math.ceil(lengthArray / limit)) {
      throw new BadRequestException(WRONG_PAGE);
    }

    const productsArray = await this.productsModel
      .find(categoryId && { categoryId })
      .collation({ locale: 'en', strength: 2 })
      .find(
        searchWord && {
          ['name']: { $regex: `${searchWord}`, $options: 'i' },
        },
      )
      .find(minCost && { cost: { $gte: minCost } })
      .find(maxCost && { cost: { $lte: maxCost } })
      .sort({ [sortPropierty]: sortDirection, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      productsArray: productsArray,
      paginationCount: Math.ceil(lengthArray / limit),
    };
  }

  async productsCountCategory(categoryId: string): Promise<number> {
    return await this.productsModel.find({ categoryId }).count();
  }
}
