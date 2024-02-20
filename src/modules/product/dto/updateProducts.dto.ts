import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsDto } from './createProducts.dto';

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}
