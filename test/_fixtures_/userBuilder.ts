import { Types } from 'mongoose';
import { User } from '../../src/modules/users/model/user-model';
import { IUser } from '../../src/modules/users/interfaces/user.interface';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class UserBuilder {
  public static defaultAll(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({ carts: [] });
  }

  public static withProducts(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('5eb6e7e7e9b7f4194e000001'),
            cost: 1000,
            amount: 10,
          },
        ],
      });
  }

  public static withProductsBigAmount(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
            cost: 1000,
            amount: 20,
          },
        ],
      });
  }

  public static withProductsSmallAmount(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('5eb6e7e7e9b7f4194e000001'),
            cost: 1000,
            amount: 5,
          },
        ],
      });
  }

  public static withFavorites(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [new Types.ObjectId('63ca54f4cc85e97cbc87392a')] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('5eb6e7e7e9b7f4194e000001'),
            cost: 1000,
            amount: 1,
          },

          {
            productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
            cost: 1000,
            amount: 2,
          },
        ],
      });
  }

  public static withOneProducts(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
            cost: 1000,
            amount: 1,
          },
        ],
      });
  }

  public static withOneProductsIcrement(): InjectionFixtureBuilder<IUser> {
    return new InjectionFixtureBuilder(new User())
      .with({ _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({ firstName: 'test firstname' })
      .with({ lastName: 'test lastname' })
      .with({ email: 'test email' })
      .with({ password: 'test password' })
      .with({ address: 'test address' })
      .with({ phone: 'test phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'test token' })
      .with({ favorites: [] })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
            cost: 1000,
            amount: 2,
          },
        ],
      });
  }
}
