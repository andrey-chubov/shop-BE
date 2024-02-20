import { ChangePasswordDto } from '../../src/modules/authentication/dto/changePassword.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class ChangePasswordDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<ChangePasswordDto> {
    return new InjectionFixtureBuilder(new ChangePasswordDto())
      .with({ token: 'test token' })
      .with({ password: 'changed pass' });
  }
}
