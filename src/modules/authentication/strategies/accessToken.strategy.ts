import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { UserDto } from '../../../modules/users/dto/user.dto';
import config from '../../../config';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.access_key,
    });
  }

  async validate(payload: UserDto) {
    const user = await this.usersService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token;
    }

    throw new UnauthorizedException();
  }
}
