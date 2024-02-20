import { IProduct } from '../interfaces/product.interface';

export class GetProductsDto {
  productsArray: IProduct[];
  paginationCount: number;
}
