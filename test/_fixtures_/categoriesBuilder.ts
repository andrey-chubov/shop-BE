import { Types } from 'mongoose';
import { ICategory } from '../../src/modules/categories/interfaces/category.interface';
import { Categories } from '../../src/modules/categories/model/categories-model';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class CategoriesBuilder {
  public static defaultAll(): InjectionFixtureBuilder<ICategory> {
    return new InjectionFixtureBuilder(new Categories())
      .with({ _id: new Types.ObjectId('63c67e205af7f0e50eddd378') })
      .with({ name: 'test category' })
      .with({ isDeleted: false })
      .with({ image: '' });
  }

  public static getId(): InjectionFixtureBuilder<ICategory> {
    return new InjectionFixtureBuilder(new Categories()).with({
      _id: new Types.ObjectId('63c67e205af7f0e50eddd378'),
    });
  }

  public static getImage(): InjectionFixtureBuilder<ICategory> {
    return new InjectionFixtureBuilder(new Categories())
      .with({ _id: new Types.ObjectId('63c67e205af7f0e50eddd378') })
      .with({ name: 'test category' })
      .with({ isDeleted: false })
      .with({ image: 'fgfdgdfg.png' });
  }
}
