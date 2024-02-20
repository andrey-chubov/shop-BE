import { FilteredProductDto } from '../../src/modules/product/dto/filterAndSortProduct.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

enum SortDirection {
  'asc' = 1,
  'desc' = -1,
}

export class FilteredProductDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<FilteredProductDto> {
    return new InjectionFixtureBuilder(new FilteredProductDto())
      .with({ sortPropierty: 'sortProperty' })
      .with({ sortDirection: SortDirection.asc })
      .with({ categoryId: 'categoryId' })
      .with({ maxCost: 1000 })
      .with({ minCost: 2 })
      .with({ searchWord: 'searchword' });
  }
}
