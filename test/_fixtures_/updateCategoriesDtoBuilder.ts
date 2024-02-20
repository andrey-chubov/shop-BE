import { UpdateCategoriesDto } from '../../src/modules/categories/dto/updateCategories.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class UpdateCategoriesDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<UpdateCategoriesDto> {
    return new InjectionFixtureBuilder(new UpdateCategoriesDto())
      .with({ name: 'test category' })
      .with({ isDeleted: false })
      .with({ image: '' });
  }
}
