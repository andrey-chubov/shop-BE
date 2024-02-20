import { CreateUserDto } from '../../src/modules/users/dto/createUser.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class CreateUserDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<CreateUserDto> {
    return new InjectionFixtureBuilder(new CreateUserDto())
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

  public static newAll(): InjectionFixtureBuilder<CreateUserDto> {
    return new InjectionFixtureBuilder(new CreateUserDto())
      .with({ firstName: 'firstname' })
      .with({ lastName: 'lastname' })
      .with({ email: 'email' })
      .with({ password: 'password' })
      .with({ address: 'address' })
      .with({ phone: 'phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'token' })
      .with({ favorites: [] })
      .with({ carts: [] });
  }
}
