import { Injectable } from '@nestjs/common';
import { FileType } from '../../shared/types/fileType';
import { FilesService } from '../../modules/files/file.service';
import { CreateProductsDto } from './dto/createProducts.dto';
import { UpdateProductsDto } from './dto/updateProducts.dto';
import { ProductsDocument } from './model/products-model';
import { ProductsRepository } from './products.repository';
import { GetProductsDto } from './dto/getProducts.dto';
import { FilteredProductDto } from './dto/filterAndSortProduct.dto';
import { IProduct } from './interfaces/product.interface';
import config from '../../config';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly filesServices: FilesService,
  ) {}

  async createProducts(
    createProductsDto: CreateProductsDto,
    files: Array<FileType>,
  ): Promise<ProductsDocument> {
    const imagesNames = await this.filesServices.createImages(files);

    return await this.productsRepository.create({
      ...createProductsDto,
      images: imagesNames,
    });
  }

  async getAllProducts(
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
  ): Promise<GetProductsDto> {
    return await this.productsRepository.find(limit, page);
  }

  async getNewProducts(): Promise<ProductsDocument[]> {
    return await this.productsRepository.findNew();
  }

  async getNewProductsByCategory(
    categoryId: string,
  ): Promise<ProductsDocument[]> {
    return await this.productsRepository.findNewByCategory(categoryId);
  }

  async getProductsByCategory(
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
    categoryId: string,
  ): Promise<GetProductsDto> {
    return await this.productsRepository.findByCategory(
      limit,
      page,
      categoryId,
    );
  }

  async getProductById(id: string): Promise<ProductsDocument> {
    return this.productsRepository.findById(id);
  }

  async updateProduct(
    id: string,
    updatedProduct: UpdateProductsDto | IProduct,
  ): Promise<ProductsDocument> {
    return this.productsRepository.updateById(id, updatedProduct);
  }

  async deleteImageProducts(
    id: string,
    updatedProduct: UpdateProductsDto,
  ): Promise<ProductsDocument> {
    const currentProduct = await this.productsRepository.findById(id);

    if (currentProduct) {
      const newImages = await this.filesServices.deleteImages(currentProduct);
      return this.productsRepository.updateById(id, {
        ...updatedProduct,
        images: newImages,
      });
    }
  }

  async getSelectedProducts(
    productIds: string[],
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
  ): Promise<GetProductsDto> {
    return this.productsRepository.findSelectedId(productIds, limit, page);
  }

  async getProductsWithFilters(
    filterAndSortProductDto: FilteredProductDto,
    limit = config.defaultLimitPagination,
    page = config.defaultPagePagination,
  ): Promise<GetProductsDto> {
    return this.productsRepository.findByFilters(
      filterAndSortProductDto,
      limit,
      page,
    );
  }

  async getAmountProductsInCategory(categoryId: string): Promise<number> {
    return this.productsRepository.productsCountCategory(categoryId);
  }
}
