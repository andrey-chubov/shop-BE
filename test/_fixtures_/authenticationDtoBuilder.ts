import { AuthenticationDto } from '../../src/modules/authentication/dto/authentication.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class AuthenticationDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<AuthenticationDto> {
    return new InjectionFixtureBuilder(new AuthenticationDto())
      .with({ email: 'email' })
      .with({ password: 'password' });
  }
}
