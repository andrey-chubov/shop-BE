import { CreateCategoriesDto } from '../../src/modules/categories/dto/createCategories.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class CreateCategoriesDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<CreateCategoriesDto> {
    return new InjectionFixtureBuilder(new CreateCategoriesDto())
      .with({ name: 'test category' })
      .with({ isDeleted: false })
      .with({ image: '' });
  }
}
