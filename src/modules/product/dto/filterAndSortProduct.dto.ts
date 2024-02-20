import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';

enum SortDirection {
  'asc' = 1,
  'desc' = -1,
}

export class FilteredProductDto {
  sortPropierty: string;

  @IsEnum(SortDirection)
  sortDirection: SortDirection;

  categoryId: string;
  maxCost: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  minCost: number;

  searchWord: string;
}
