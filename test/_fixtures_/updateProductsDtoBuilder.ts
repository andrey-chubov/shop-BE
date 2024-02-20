import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';
import { CategoriesBuilder } from './categoriesBuilder';
import { UpdateProductsDto } from '../../src/modules/product/dto/updateProducts.dto';

export class UpdateProductsDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<UpdateProductsDto> {
    return new InjectionFixtureBuilder(new UpdateProductsDto())
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
