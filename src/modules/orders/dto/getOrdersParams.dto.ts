import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import config from '../../../config';

export class GetOrdersParamsDto {
  @IsInt()
  @Type(() => Number)
  @Min(config.minLimitOrPageOfPagination, {
    message: `Минимальное количество заказов на странице - ${config.minLimitOrPageOfPagination}!`,
  })
  @Max(config.maxLimitOfPagination, {
    message: `Максимальное количество заказов на странице - ${config.maxLimitOfPagination}!`,
  })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Min(config.minLimitOrPageOfPagination, {
    message: `Минимальная страница для отображения - ${config.minLimitOrPageOfPagination}!`,
  })
  page: number;
}
