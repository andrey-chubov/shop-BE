import { Types } from 'mongoose';
import { UserDto } from '../../../../src/modules/users/dto/user.dto';
import { User } from '../../../../src/modules/users/model/user-model';

describe('UserDto constructor', () => {
  const userStub: User = {
    _id: new Types.ObjectId('4eb6e7e7e9b7f4194e000001'),
    firstName: 'test firstname',
    lastName: 'test lastname',
    email: 'test email',
    password: 'test password',
    address: 'test address',
    phone: 'test phone',
    isAdmin: false,
    refreshToken: 'test token',
    favorites: [],
    carts: [],
  };

  test('User should be initialized  through constructor', () => {
    const user = new UserDto(userStub);

    expect(user).toEqual({
      id: '4eb6e7e7e9b7f4194e000001',
      email: 'test email',
      isAdmin: false,
      favorites: [],
      carts: [],
    });
  });
});
