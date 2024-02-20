import { UpdateUserDto } from '../../src/modules/users/dto/updateUser.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class UpdateUserDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<UpdateUserDto> {
    return new InjectionFixtureBuilder(new UpdateUserDto())
      .with({ firstName: 'update name' })
      .with({ lastName: 'update lastname' })
      .with({ email: 'update email' })
      .with({ password: 'update password' })
      .with({ address: 'update address' })
      .with({ phone: 'update phone' })
      .with({ isAdmin: false })
      .with({ refreshToken: 'update token' })
      .with({ favorites: [] })
      .with({ carts: [] });
  }
}
