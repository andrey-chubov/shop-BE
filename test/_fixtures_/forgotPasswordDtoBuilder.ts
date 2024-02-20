import { ForgotPasswordDto } from '../../src/modules/authentication/dto/forgotPassword.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class ForgotPasswordDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<ForgotPasswordDto> {
    return new InjectionFixtureBuilder(new ForgotPasswordDto())
      .with({ email: 'test email' })
      .with({ geolocation: 'Novocherkassk' });
  }
}
