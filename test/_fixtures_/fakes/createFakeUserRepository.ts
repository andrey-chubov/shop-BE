import { UsersRepository } from '../../../src/modules/users/users.repository';
import { UserBuilder } from '../userBuilder';

export const createFakeUserRepository = (): Record<
  keyof UsersRepository,
  jest.Mock
> => ({
  find: jest.fn().mockReturnValue([mockUser]),
  findById: jest.fn().mockReturnValue(mockUser),
  findOne: jest.fn().mockReturnValue(mockUser),
  updateById: jest.fn().mockReturnValue(mockUser),
  deleteById: jest.fn().mockReturnValue(mockUser),
  create: jest.fn().mockReturnValue(mockUser),
});

const mockUser = UserBuilder.defaultAll().result;
