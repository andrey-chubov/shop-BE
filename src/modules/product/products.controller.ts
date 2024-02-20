import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipes } from '../../pipes/userValidation.pipe';
import { CreateProductsDto } from './dto/createProducts.dto';
import { UpdateProductsDto } from './dto/updateProducts.dto';
import { ProductsService } from './products.service';
import { GetProductsParamsDto } from './dto/getProductsParams.dto';
import { FileType } from '../../shared/types/fileType';
import { assertFileFormat } from '../../modules/files/assertFileFormat';
import { diskStorage } from 'multer';
import { editFileName } from '../../modules/files/editFileName';
import { ProductsDocument } from './model/products-model';
import { FilteredProductDto } from './dto/filterAndSortProduct.dto';
import { GetProductsDto } from './dto/getProducts.dto';
import { GetSelectedProductsDto } from './dto/getSelectedProducts.dto';
import { IProduct } from './interfaces/product.interface';
import config from '../../config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UsePipes(UserValidationPipes)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', config.maxCountImagesProducts, {
      storage: diskStorage({
        destination: './dist/static/images',
        filename: editFileName,
      }),
      fileFilter: assertFileFormat,
    }),
  )
  createProducts(
    @Body() createProductsDto: CreateProductsDto,
    @UploadedFiles() files: Array<FileType>,
  ): Promise<ProductsDocument> {
    return this.productsService.createProducts(createProductsDto, files);
  }

  @UsePipes(UserValidationPipes)
  @Get('filter')
  getProductsWithFilters(
    @Query() filterAndSortProductDto: FilteredProductDto,
    @Query() queryParams: GetProductsParamsDto,
  ): Promise<GetProductsDto> {
    return this.productsService.getProductsWithFilters(
      filterAndSortProductDto,
      queryParams.limit,
      queryParams.page,
    );
  }

  @Get('new')
  getNewProducts(): Promise<ProductsDocument[]> {
    return this.productsService.getNewProducts();
  }

  @Get('new/:categoryId')
  getNewProductsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductsDocument[]> {
    return this.productsService.getNewProductsByCategory(categoryId);
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Promise<ProductsDocument> {
    return this.productsService.getProductById(id);
  }

  @UsePipes(UserValidationPipes)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductsDto | IProduct,
  ): Promise<ProductsDocument> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Patch('images/:id')
  deleteImageProducts(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductsDto,
  ): Promise<ProductsDocument> {
    return this.productsService.deleteImageProducts(id, updateProductDto);
  }

  @UsePipes(UserValidationPipes)
  @Get()
  getAllProducts(
    @Query() queryParams: GetProductsParamsDto,
  ): Promise<GetProductsDto> {
    return this.productsService.getAllProducts(
      queryParams.limit,
      queryParams.page,
    );
  }

  @UsePipes(UserValidationPipes)
  @Get('category/:categoryId')
  getProductsByCategory(
    @Query() queryParams: GetProductsParamsDto,
    @Param('categoryId') categoryId: string,
  ): Promise<GetProductsDto> {
    return this.productsService.getProductsByCategory(
      queryParams.limit,
      queryParams.page,
      categoryId,
    );
  }

  @UsePipes(UserValidationPipes)
  @Post('selected/')
  getSelectedProducts(
    @Body() products: GetSelectedProductsDto,
    @Query() queryParams: GetProductsParamsDto,
  ): Promise<GetProductsDto> {
    return this.productsService.getSelectedProducts(
      products.productIds,
      queryParams.limit,
      queryParams.page,
    );
  }
}
