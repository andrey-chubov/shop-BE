import { Types } from 'mongoose';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';
import { IProduct } from '../../src/modules/product/interfaces/product.interface';
import { Products } from '../../src/modules/product/model/products-model';
import { CategoriesBuilder } from './categoriesBuilder';

export class ProductsBuilder {
  public static defaultAll(): InjectionFixtureBuilder<IProduct> {
    return new InjectionFixtureBuilder(new Products())
      .with({ _id: new Types.ObjectId('63c686405af7f0e50eddd38d') })
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 10 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ updatedAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result });
  }

  public static smallAmount(): InjectionFixtureBuilder<IProduct> {
    return new InjectionFixtureBuilder(new Products())
      .with({ _id: new Types.ObjectId('63c686405af7f0e50eddd38d') })
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 1 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ updatedAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result });
  }

  public static setNullAmount(): InjectionFixtureBuilder<IProduct> {
    return new InjectionFixtureBuilder(new Products())
      .with({ _id: new Types.ObjectId('63c686405af7f0e50eddd38d') })
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 0 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ updatedAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result });
  }

  public static getAnotherProduct(): InjectionFixtureBuilder<IProduct> {
    return new InjectionFixtureBuilder(new Products())
      .with({ _id: new Types.ObjectId('5eb6e7e7e9b7f4194e000001') })
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 5 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ updatedAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result });
  }

  public static getAnotherProductSmall(): InjectionFixtureBuilder<IProduct> {
    return new InjectionFixtureBuilder(new Products())
      .with({ _id: new Types.ObjectId('5eb6e7e7e9b7f4194e000001') })
      .with({ name: 'test product' })
      .with({ productId: 'test productId' })
      .with({ cost: 1000 })
      .with({ amount: 1 })
      .with({ description: 'test' })
      .with({ isDeleted: false })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ updatedAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ images: [] })
      .with({ categoryId: CategoriesBuilder.getId().result });
  }
}
