import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesDto } from './createCategories.dto';

export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {}
