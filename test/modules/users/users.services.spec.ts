import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createFakeUserRepository } from '../../_fixtures_/fakes/createFakeUserRepository';
import { UsersService } from '../../../src/modules/users/users.service';
import { UsersRepository } from '../../../src/modules/users/users.repository';
import { UpdateUserDtoBuilder } from '../../_fixtures_/updateUserDtoBuilder';
import { CreateUserDtoBuilder } from '../../_fixtures_/createUserDtoBuilder';
import { ChangeUserPasswordDtoBuilder } from '../../_fixtures_/changeUserPasswordDtoBuilder';
import {
  WRONG_PASSWORD,
  WRONG_USER,
} from '../../../src/shared/errors/errorMessages';
import { UserBuilder } from '../../_fixtures_/userBuilder';
import { IUser } from '../../../src/modules/users/interfaces/user.interface';

describe('UsersService', () => {
  let userService: UsersService;
  const stubRepository = createFakeUserRepository();
  const createUserDto = CreateUserDtoBuilder.defaultAll().result;
  const updateUserDto = UpdateUserDtoBuilder.defaultAll().result;
  const mockUser = UserBuilder.defaultAll().result;
  const changePassword = ChangeUserPasswordDtoBuilder.defaultAll().result;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersService],
      providers: [
        {
          provide: UsersRepository,
          useValue: stubRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('finUserById', () => {
    describe('when finUserById is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.findUserById(mockUser._id.toString());
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.findById).toBeCalledWith(mockUser._id.toString());
      });

      test('then is should be return a user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('getAllUsers', () => {
    describe('when getAllUsers  is called', () => {
      let users: IUser[];

      beforeEach(async () => {
        users = await userService.getAllUsers();
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.find).toHaveBeenCalled();
      });

      test('then is should be return  users', () => {
        expect(users).toEqual([mockUser]);
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.createUser(createUserDto);
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.create).toHaveBeenCalled();
      });

      test('then is should be return  user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.updateUser(
          mockUser._id.toString(),
          updateUserDto,
        );
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.updateById).toHaveBeenCalledWith(
          mockUser._id.toString(),
          updateUserDto,
        );
      });

      test('then is should be return  user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('deleteUserById', () => {
    describe('when deleteUserById is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.deleteUserById(mockUser._id.toString());
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.deleteById).toBeCalledWith(
          mockUser._id.toString(),
        );
      });

      test('then is should be return a user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('findUserByPhone', () => {
    describe('when findUserByPhone is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.findUserByPhone(mockUser.phone);
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.findOne).toBeCalledWith({
          phone: mockUser.phone,
        });
      });

      test('then is should be return a user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('findUserByEmail', () => {
    describe('when findUserByEmail is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.findUserByEmail(mockUser.email);
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.findOne).toBeCalledWith({
          email: mockUser.email,
        });
      });

      test('then is should be return a user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('findUserByRefershToken', () => {
    describe('when findUserByRefershToken is called', () => {
      let user: IUser;

      beforeEach(async () => {
        user = await userService.findUserByRefreshToken(mockUser.refreshToken);
      });

      test('then it should call usersRepository', () => {
        expect(stubRepository.findOne).toBeCalledWith({
          refreshToken: mockUser.refreshToken,
        });
      });

      test('then is should be return a user', () => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('assertPassword', () => {
    const passwordWrong = 'aaaaa21';
    const password = 'qqqqqq1';
    const userPassword =
      '$2a$10$ln3wb/hlTsRT/0stTUxpduRmYCBUp3oDWwUT96h89NocjDZTr1NPi';
    const cases = [
      {
        toString: () => '1 if password not wrong return nothing',
        passwordUserTest: userPassword,
        passwordTest: password,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when password wrong',
        passwordUserTest: userPassword,
        passwordTest: passwordWrong,
        expected: new BadRequestException(WRONG_PASSWORD),
      },
    ];

    test.each(cases)(
      '%s',
      async ({ passwordUserTest, passwordTest, expected }) => {
        try {
          const result = await userService.assertPassword(
            passwordUserTest,
            passwordTest,
          );
          expect(result).toStrictEqual(expected);
        } catch (error) {
          expect(error).toStrictEqual(expected);
        }
      },
    );
  });

  describe('changePassword', () => {
    test('should be call updateById with ("1",{password: "test"} )', async () => {
      const spyBcryptHash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((): any => 'test new password');
      const spyBcryptCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((): any => true);
      const spyUserUpdate = jest.spyOn(stubRepository, 'updateById');
      await userService.changePassword('1', changePassword);
      expect(spyBcryptHash).toBeCalledTimes(1);
      expect(spyBcryptCompare).toBeCalledTimes(1);
      expect(spyUserUpdate).toBeCalledWith('1', {
        password: 'test new password',
      });
    });
  });

  describe('assertUserExistsById', () => {
    const spyRepository = jest
      .spyOn(stubRepository, 'findById')
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUser)
      .mockRejectedValue(new BadRequestException(WRONG_USER));
    const cases = [
      {
        toString: () => '1 if user exists return user',
        id: 'g324324',
        expected: mockUser,
      },
      {
        toString: () => '2 should be return exception, when wrong user',
        id: null,
        expected: new BadRequestException(WRONG_USER),
      },
    ];

    test.each(cases)('%s', async ({ id, expected }) => {
      try {
        const result = await userService.assertUserExistsById(id);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });
});
