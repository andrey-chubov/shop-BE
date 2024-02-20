import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../src/modules/users/users.service';
import { MailService } from '../../../src/modules/mail/mail.service';
import { AuthenticationService } from '../../../src/modules/authentication/authentication.service';
import { createFakeUserService } from '../../_fixtures_/fakes/createFakeUserService';
import { createFakeJwtService } from '../../_fixtures_/fakes/createFakeJwtService';
import { createFakeMailService } from '../../_fixtures_/fakes/createFakeMailService';
import { UserDto } from '../../../src/modules/users/dto/user.dto';
import { CreateUserDtoBuilder } from '../../_fixtures_/createUserDtoBuilder';
import { UserBuilder } from '../../_fixtures_/userBuilder';
import { ForgotPasswordDtoBuilder } from '../../_fixtures_/forgotPasswordDtoBuilder';
import { ChangePasswordDtoBuilder } from '../../_fixtures_/changePasswordDtoBuilder';
import { AuthenticationTokensBuilder } from '../../_fixtures_/authenticationTokensBuilder';
import {
  EMAIL_EXISTS,
  PHONE_EXISTS,
} from '../../../src/shared/errors/errorMessages';
import { AuthenticationDtoBuilder } from '../../_fixtures_/authenticationDtoBuilder';

describe('AuthService', () => {
  let authService: AuthenticationService;
  const stubUserService = createFakeUserService();
  const stubJwtService = createFakeJwtService();
  const stubMailService = createFakeMailService();
  const mockNewUser = CreateUserDtoBuilder.defaultAll().result;
  const mockAuthUser = AuthenticationDtoBuilder.defaultAll().result;
  const mockUserPhoneEmail = CreateUserDtoBuilder.newAll().result;
  const mockUser = UserBuilder.defaultAll().result;
  const userDto = new UserDto(mockUser);
  const forgotUser = ForgotPasswordDtoBuilder.defaultAll().result;
  const token = AuthenticationTokensBuilder.defaultAll().result;
  const changePassDto = ChangePasswordDtoBuilder.defaultAll().result;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthenticationService],
      providers: [
        {
          provide: UsersService,
          useValue: stubUserService,
        },
        {
          provide: JwtService,
          useValue: stubJwtService,
        },
        {
          provide: MailService,
          useValue: stubMailService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthenticationService>(AuthenticationService);
    jest.clearAllMocks();
  });

  describe('assertPhoneExists', () => {
    const cases = [
      {
        toString: () => '1 if phone not exists return nothing',
        mockNewUser: mockUserPhoneEmail,
        mockUser,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when phone exists',
        mockNewUser,
        mockUser,
        expected: new BadRequestException(PHONE_EXISTS),
      },
    ];

    test.each(cases)('%s', async ({ mockNewUser, mockUser, expected }) => {
      try {
        const result = authService.assertPhoneExists(mockNewUser, mockUser);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('assertEmailExists', () => {
    const cases = [
      {
        toString: () => '1 if email not exists return nothing',
        mockNewUser: mockUserPhoneEmail,
        mockUser,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when email exists',
        mockNewUser,
        mockUser,
        expected: new BadRequestException(EMAIL_EXISTS),
      },
    ];

    test.each(cases)('%s', async ({ mockNewUser, mockUser, expected }) => {
      try {
        const result = authService.assertEmailExists(mockNewUser, mockUser);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('getTokens', () => {
    test('should be return token', async () => {
      const tokens = await authService.getTokens(userDto);
      expect(tokens).toEqual(token);
    });
  });

  describe('validateUser', () => {
    test('should be return exception, when user not found', async () => {
      try {
        await authService.validateUser(mockAuthUser);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
    test('should be return userDto', async () => {
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserByEmail')
        .mockImplementation((): any => mockUser);
      const spyBcrypt = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((): any => true);

      expect(await authService.validateUser(mockAuthUser)).toEqual(userDto);
      expect(spyUserFind).toBeCalledTimes(1);
      expect(spyBcrypt).toBeCalledTimes(1);
    });
  });

  describe('forgotPassword', () => {
    test('should be called  sendMailResetPassword', async () => {
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserByEmail')
        .mockImplementation((): any => mockUser);
      const spyUserUpdate = jest
        .spyOn(stubUserService, 'updateUser')
        .mockImplementation((): any => mockUser);
      const spyMail = jest.spyOn(stubMailService, 'sendMailResetPassword');

      await authService.forgotPassword(forgotUser);
      expect(spyUserFind).toBeCalledTimes(1);
      expect(spyUserUpdate).toBeCalledTimes(1);
      expect(spyMail).toBeCalledTimes(1);
    });
    test('should be return exception, when user not found', async () => {
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserByEmail')
        .mockImplementation((): any => undefined);

      try {
        await authService.forgotPassword(forgotUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(spyUserFind).toBeCalledTimes(1);
      }
    });
  });

  describe('logout', () => {
    test('should be  called userService method updateUser', async () => {
      const spyUserUpdate = jest.spyOn(stubUserService, 'updateUser');
      await authService.logout(userDto);
      expect(spyUserUpdate).toBeCalledWith(mockUser._id.toString(), {
        refreshToken: '',
      });
      expect(spyUserUpdate).toBeCalledTimes(1);
    });
  });

  describe('refresh', () => {
    test("should be return { accessToken: '1', refreshToken: '1', user: userDto}", async () => {
      expect(await authService.refresh(userDto)).toEqual({
        ...token,
        user: userDto,
      });
    });
  });

  describe('changePassword', () => {
    test('should be return exception if user not found by refeshToken', async () => {
      try {
        await authService.changePassword(changePassDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    test('should be run updateUser with (userDto.id, {password: test})', async () => {
      const spyUserFindRefeshToken = jest
        .spyOn(stubUserService, 'findUserByRefreshToken')
        .mockImplementation((): any => mockUser);
      const spyBcrypt = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((): any => 'test');
      const spyUserUpdate = jest.spyOn(stubUserService, 'updateUser');
      await authService.changePassword(changePassDto);
      expect(spyUserFindRefeshToken).toBeCalledTimes(1);
      expect(spyBcrypt).toBeCalledTimes(1);
      expect(spyUserUpdate).toBeCalledWith(userDto.id, { password: 'test' });
    });
  });

  describe('wrongPassword', () => {
    test('should be return exception if user not found by Email', async () => {
      try {
        await authService.wrongPassword(forgotUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    test('should be called  sendNotification with {"1","test firstname", "test email", "Novocherkassk"  }', async () => {
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserByEmail')
        .mockImplementation((): any => mockUser);
      const spyMail = jest.spyOn(stubMailService, 'sendNotification');

      await authService.wrongPassword(forgotUser);
      expect(spyUserFind).toBeCalledTimes(1);
      expect(spyMail).toBeCalledWith(
        token.refreshToken,
        mockUser.firstName,
        mockUser.email,
        forgotUser.geolocation,
      );
    });
  });

  describe('registration', () => {
    test("should be return { accessToken: '1', refreshToken: '1', user: userDto}", async () => {
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserByEmail')
        .mockImplementation((): any => '');
      const spyUserCreate = jest
        .spyOn(stubUserService, 'createUser')
        .mockImplementation((): any => mockUser);
      expect(await authService.registration(mockNewUser)).toEqual({
        accessToken: '1',
        refreshToken: '1',
        user: userDto,
      });
      expect(spyUserFind).toBeCalledTimes(1);
      expect(spyUserCreate).toBeCalledTimes(1);
    });
  });

  describe('login', () => {
    test("should be return { accessToken: '1', refreshToken: '1', user: userDto}", async () => {
      expect(await authService.login(userDto)).toEqual({
        ...token,
        user: userDto,
      });
    });
  });
});
