import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../modules/users/users.module';
import { MailModule } from '../../modules/mail/mail.module';
import { AuthenticationController } from '../../modules/authentication/authentication.controller';
import { AuthenticationService } from '../../modules/authentication/authentication.service';
import { AccessTokenStrategy } from '../../modules/authentication/strategies/accessToken.strategy';
import { LocalStrategy } from '../../modules/authentication/strategies/local.strategy';
import { RefreshTokenStrategy } from '../../modules/authentication/strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule, PassportModule, MailModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthenticationModule {}
