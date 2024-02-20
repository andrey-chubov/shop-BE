import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';
import { CategoriesBuilder } from './categoriesBuilder';
import { CreateProductsDto } from '../../src/modules/product/dto/createProducts.dto';

export class CreateProductsDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<CreateProductsDto> {
    return new InjectionFixtureBuilder(new CreateProductsDto())
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 10 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result._id.toString() });
  }
}
