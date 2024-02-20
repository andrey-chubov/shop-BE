import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { UserDto } from '../../../modules/users/dto/user.dto';
import config from '../../../config';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.refresh_key,
      passReqToCallback: true,
    });
  }

  async validate(req: RequestType) {
    const refreshToken = req.cookies.refresh_token;
    const user = await this.usersService.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException();
    }

    const userData = new UserDto(user);

    return userData;
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }

    throw new UnauthorizedException();
  }
}
