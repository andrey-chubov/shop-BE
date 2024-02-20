import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';
import { GetProductsDto } from '../../src/modules/product/dto/getProducts.dto';
import { ProductsBuilder } from './productBuilder';

export class GetProductsDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<GetProductsDto> {
    return new InjectionFixtureBuilder(new GetProductsDto())
      .with({
        productsArray: [mockProduct],
      })
      .with({ paginationCount: 1 });
  }
}

const mockProduct = ProductsBuilder.defaultAll().result;
