import { UsersService } from '../../../src/modules/users/users.service';

export const createFakeUserService = (): Record<
  keyof UsersService,
  jest.Mock
> => ({
  getAllUsers: jest.fn(),
  findUserByEmail: jest.fn().mockReturnValue(''),
  createUser: jest.fn(),
  findUserById: jest.fn(),
  findUserByPhone: jest.fn().mockReturnValue(''),
  findUserByRefreshToken: jest.fn().mockReturnValue(''),
  updateUser: jest.fn(),
  deleteUserById: jest.fn(),
  changePassword: jest.fn(),
  assertPassword: jest.fn(),
  assertUserExistsById: jest.fn(),
});
