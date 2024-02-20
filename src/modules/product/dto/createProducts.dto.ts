import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateProductsDto {
  @IsString()
  @IsNotEmpty({ message: 'Название товара не должно быть пустым!' })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;

  @IsNumberString()
  @IsNotEmpty({ message: 'Укажите артикул товара!' })
  productId: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Укажите цену товара!' })
  cost: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Укажите количество товара!' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Описание товара не должно быть пустым!' })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Добавте хотябы одну фотографию товара!' })
  images: string[];

  @IsString()
  @IsNotEmpty({ message: 'Укажите категорию товара!' })
  categoryId: string;
}
