import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class GetSelectedProductsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];
}
