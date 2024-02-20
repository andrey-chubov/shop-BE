import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import config from '../../config';
import {
  EMAIL_EXISTS,
  PHONE_EXISTS,
  WRONG_LINK,
  WRONG_PASSWORD,
  WRONG_USER,
} from '../../shared/errors/errorMessages';
import { CreateUserDto } from '../../modules/users/dto/createUser.dto';
import { UserDto } from '../../modules/users/dto/user.dto';
import { UsersService } from '../../modules/users/users.service';
import { MailService } from '../../modules/mail/mail.service';
import { AuthenticationDto } from './dto/authentication.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { AuthenticationTokens } from './dto/tokens.dto';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class AuthenticationService {
  private logger = new Logger('AuthenticationService');

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async registration(
    createUserDto: CreateUserDto,
  ): Promise<AuthenticationTokens> {
    const user = await this.usersService.findUserByEmail(createUserDto.email);
    this.assertEmailExists(createUserDto, user);
    const userByPhone = await this.usersService.findUserByPhone(
      createUserDto.phone,
    );
    this.assertPhoneExists(createUserDto, userByPhone);
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      config.bcryptSalt,
    );
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const userDto = new UserDto(newUser);
    const tokens = await this.getTokens(userDto);
    await this.usersService.updateUser(userDto.id, {
      refreshToken: tokens.refreshToken,
    });
    this.logger.log(`Registration new user ${createUserDto.email}`);
    return { ...tokens, user: userDto };
  }

  async login(user: UserDto): Promise<AuthenticationTokens> {
    const tokens = await this.getTokens(user);
    await this.usersService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
    });
    this.logger.log(`Loggining  user ${user.email}`);
    return { ...tokens, user };
  }

  async getTokens(user: UserDto): Promise<AuthenticationTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...user },
        {
          secret: config.access_key,
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        { ...user },
        {
          secret: config.refresh_key,
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userData: AuthenticationDto): Promise<UserDto> {
    const user = await this.usersService.findUserByEmail(userData.email);
    if (!user) {
      throw new UnauthorizedException(WRONG_USER);
    }
    const passwordMatches = await bcrypt.compare(
      userData.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    const userDto = new UserDto(user);

    return userDto;
  }

  async logout(user: UserDto): Promise<void> {
    await this.usersService.updateUser(user.id, {
      refreshToken: '',
    });
    this.logger.log(`Logout ${user.email}`);
  }

  async refresh(user: UserDto): Promise<AuthenticationTokens> {
    const tokens = await this.getTokens(user);
    await this.usersService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
    });
    this.logger.log(`For  ${user.email} generate new refreshToken`);
    return { ...tokens, user };
  }

  async forgotPassword(forgotPasswordDro: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findUserByEmail(
      forgotPasswordDro.email,
    );
    if (!user) {
      throw new BadRequestException(WRONG_USER);
    }

    const userData = new UserDto(user);
    const tokens = await this.getTokens(userData);
    await this.usersService.updateUser(userData.id, {
      refreshToken: tokens.refreshToken,
    });
    this.logger.log(`Send email on  ${user.email} for restoring password`);
    await this.mailService.sendMailResetPassword(
      tokens.refreshToken,
      user.firstName,
      user.email,
    );
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findUserByRefreshToken(
      changePasswordDto.token,
    );
    if (!user) {
      throw new BadRequestException(WRONG_LINK);
    }

    const userData = new UserDto(user);
    const password = await bcrypt.hash(
      changePasswordDto.password,
      config.bcryptSalt,
    );
    this.logger.log(`Change password for user:  ${userData.email}`);
    await this.usersService.updateUser(userData.id, { password });
  }

  async wrongPassword(forgotPasswordDro: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findUserByEmail(
      forgotPasswordDro.email,
    );
    if (!user) {
      throw new BadRequestException(WRONG_USER);
    }

    const userData = new UserDto(user);
    const tokens = await this.getTokens(userData);
    this.logger.log(`Try log in ${user.email} with wrong password`);
    await this.mailService.sendNotification(
      tokens.refreshToken,
      user.firstName,
      user.email,
      forgotPasswordDro.geolocation,
    );
  }

  assertEmailExists(userDto: CreateUserDto, user: IUser): void {
    if (user) {
      if (userDto.email === user.email) {
        throw new BadRequestException(EMAIL_EXISTS);
      }
    }
  }

  assertPhoneExists(userDto: CreateUserDto, user: IUser): void {
    if (user) {
      if (userDto.phone === user.phone) {
        throw new BadRequestException(PHONE_EXISTS);
      }
    }
  }
}
