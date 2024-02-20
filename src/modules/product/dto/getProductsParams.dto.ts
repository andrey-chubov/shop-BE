import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import config from '../../../config';

export class GetProductsParamsDto {
  @IsInt()
  @Type(() => Number)
  @Min(config.minLimitOrPageOfPagination, {
    message: `Минимальное количество товаров на странице - ${config.minLimitOrPageOfPagination}!`,
  })
  @Max(config.maxLimitOfPagination, {
    message: `Максимальное количество товаров на странице - ${config.maxLimitOfPagination}!`,
  })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Min(config.minLimitOrPageOfPagination, {
    message: `Минимальная страница для отображения - ${config.minLimitOrPageOfPagination}!`,
  })
  page: number;
}
