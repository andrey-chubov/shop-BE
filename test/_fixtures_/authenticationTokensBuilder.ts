import { AuthenticationTokens } from '../../src/modules/authentication/dto/tokens.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class AuthenticationTokensBuilder {
  public static defaultAll(): InjectionFixtureBuilder<AuthenticationTokens> {
    return new InjectionFixtureBuilder(new AuthenticationTokens())
      .with({ accessToken: '1' })
      .with({ refreshToken: '1' });
  }
}
