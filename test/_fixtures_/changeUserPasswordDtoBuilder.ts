import { changeUserPasswordDto } from '../../src/modules/users/dto/changeUserPassword.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class ChangeUserPasswordDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<changeUserPasswordDto> {
    return new InjectionFixtureBuilder(new changeUserPasswordDto())
      .with({ password: 'test password' })
      .with({ passwordNew: 'test new password' });
  }
}
