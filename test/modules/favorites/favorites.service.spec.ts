import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { createFakeUserService } from '../../_fixtures_/fakes/createFakeUserService';
import { FavoritesService } from '../../../src/modules/favorites/favorites.service';
import { UserBuilder } from '../../_fixtures_/userBuilder';
import { UsersService } from '../../../src/modules/users/users.service';
import { WRONG_USER } from '../../../src/shared/errors/errorMessages';

describe('FavoritesService', () => {
  let favoriteService: FavoritesService;
  const stubUserService = createFakeUserService();
  const mockUser = UserBuilder.defaultAll().result;
  const mockUserFavorites = UserBuilder.withFavorites().result;
  const spyUserFind = jest
    .spyOn(stubUserService, 'findUserById')
    .mockReturnValueOnce(mockUser)
    .mockReturnValueOnce(mockUserFavorites)
    .mockRejectedValue(new BadRequestException(WRONG_USER));
  const spyUserUpdate = jest
    .spyOn(stubUserService, 'updateUser')
    .mockReturnValueOnce(mockUserFavorites)
    .mockReturnValueOnce(mockUser);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [FavoritesService],
      providers: [
        {
          provide: UsersService,
          useValue: stubUserService,
        },
      ],
    }).compile();

    favoriteService = moduleRef.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  describe('toggleUserFavorites', () => {
    const cases = [
      {
        toString: () => '1 add product in favorites',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '63ca54f4cc85e97cbc87392a',
        expected: mockUserFavorites,
      },
      {
        toString: () => '2 delete product from favorites',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '63ca54f4cc85e97cbc87392a',
        expected: mockUser,
      },
      {
        toString: () => '2 should be return exception, when wrong user',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '63ca54f4cc85e97cbc87392a',
        expected: new BadRequestException(WRONG_USER),
      },
    ];

    test.each(cases)('%s', async ({ id, productId, expected }) => {
      try {
        const result = await favoriteService.toggleUserFavorites(id, productId);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });
});
