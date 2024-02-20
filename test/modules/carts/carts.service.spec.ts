import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartsService } from '../../../src/modules/carts/carts.service';
import { createFakeUserService } from '../../_fixtures_/fakes/createFakeUserService';
import { UsersService } from '../../../src/modules/users/users.service';
import { ProductsService } from '../../../src/modules/product/products.service';
import { createFakeProductService } from '../../_fixtures_/fakes/createFakeProductService';
import { UserBuilder } from '../../_fixtures_/userBuilder';
import { IUser } from '../../../src/modules/users/interfaces/user.interface';
import {
  WRONG_AMOUNT_PRODUCTS,
  WRONG_PRODUCT,
  WRONG_USER,
} from '../../../src/shared/errors/errorMessages';
import { ProductsBuilder } from '../../_fixtures_/productBuilder';
import { CartType } from '../../../src/shared/types/cartType';
import { UpdateCartDtoBuilder } from '../../_fixtures_/updateCartDtoBuilder';
import { LocalCartType } from 'src/shared/types/localCartType';
import { Types } from 'mongoose';

describe('CartsService', () => {
  let cartService: CartsService;
  const stubUserService = createFakeUserService();
  const stubProductsService = createFakeProductService();
  const mockProd = ProductsBuilder.defaultAll().result;
  const mockProdAnother = ProductsBuilder.getAnotherProductSmall().result;
  const spyProduct = jest
    .spyOn(stubProductsService, 'getProductById')
    .mockReturnValueOnce('')
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce('')
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce('')
    .mockReturnValueOnce('')
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce('')
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProd)
    .mockReturnValueOnce(mockProdAnother)
    .mockReturnValueOnce(mockProdAnother);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [CartsService],
      providers: [
        {
          provide: UsersService,
          useValue: stubUserService,
        },
        {
          provide: ProductsService,
          useValue: stubProductsService,
        },
      ],
    }).compile();
    cartService = moduleRef.get<CartsService>(CartsService);
    jest.clearAllMocks();
  });

  describe('clearCart', () => {
    const mockUser = UserBuilder.defaultAll().result;
    const mockUserCarts = UserBuilder.withProducts().result;
    const spyUserUpdate = jest
      .spyOn(stubUserService, 'updateUser')
      .mockReturnValueOnce(mockUser);

    describe('when clearCart is called', () => {
      let user: IUser;
      const spyUserFind = jest
        .spyOn(stubUserService, 'findUserById')
        .mockReturnValueOnce(mockUserCarts)
        .mockReturnValueOnce('');

      const cases = [
        {
          toString: () => '1 should be return user with empty carts',
          id: mockUserCarts._id.toString(),
          expected: mockUser,
        },
        {
          toString: () => '2 should be return exception, when wrong user',
          id: mockUserCarts._id.toString(),
          expected: new BadRequestException(WRONG_USER),
        },
      ];

      test.each(cases)('%s', async ({ id, expected }) => {
        try {
          user = await cartService.clearCart(id);
          expect(stubUserService.findUserById).toBeCalledWith(
            mockUserCarts._id.toString(),
          );
          expect(stubUserService.updateUser).toBeCalledWith(
            mockUserCarts._id.toString(),
            mockUserCarts,
          );
          expect(user).toStrictEqual(expected);
        } catch (error) {
          expect(error).toStrictEqual(expected);
        }
      });
    });
  });

  describe('toggleUserCarts', () => {
    const mockUser = UserBuilder.defaultAll().result;
    const mockUserProduct = UserBuilder.withOneProducts().result;
    const spyUserFind = jest
      .spyOn(stubUserService, 'findUserById')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUserProduct);
    const spyUserUpdate = jest
      .spyOn(stubUserService, 'updateUser')
      .mockReturnValueOnce(mockUserProduct)
      .mockReturnValueOnce(mockUser);

    const cases = [
      {
        toString: () => '1 should be return exception, when wrong user',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '5eb6e7e7e9b7f4194e000001',
        expected: new NotFoundException(WRONG_USER),
      },
      {
        toString: () => '2 should be return exception, when wrong product',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '5eb6e7e7e9b7f4194e000001',
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () => '3 add product in carts',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '63c686405af7f0e50eddd38d',
        expected: mockUserProduct,
      },
      {
        toString: () => '4 delete product from carts',
        id: '4eb6e7e7e9b7f4194e000001',
        productId: '63c686405af7f0e50eddd38d',
        expected: mockUser,
      },
    ];

    test.each(cases)('%s', async ({ id, productId, expected }) => {
      try {
        const result = await cartService.toggleUserCarts(id, productId);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('getProductWithNewAmount', () => {
    let cart: CartType;
    const mockProduct = ProductsBuilder.defaultAll().result;
    const mockProductSmallAmount = ProductsBuilder.smallAmount().result;
    const mockCart: CartType = {
      productId: mockProduct._id,
      amount: mockProduct.amount,
      cost: mockProduct.cost,
    };
    const mockCartSmall: CartType = {
      productId: mockProductSmallAmount._id,
      amount: 5,
      cost: mockProductSmallAmount.cost,
    };
    const cases = [
      {
        toString: () => '1 should be should be return exception',
        id: mockProduct._id.toString(),
        amount: 10,
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () =>
          '2 should be return mockProduct when amount bigger then product.amount',
        id: mockProduct._id.toString(),
        amount: 20,
        expected: mockCart,
      },
      {
        toString: () => '3 should be return  mockProductSmallAmount',
        id: mockProduct._id.toString(),
        amount: 5,
        expected: mockCartSmall,
      },
    ];

    test.each(cases)('%s', async ({ id, amount, expected }) => {
      try {
        cart = await cartService.getProductWithNewAmount(id, amount);

        expect(cart).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('UpdateCart', () => {
    let user: IUser;
    const mockUserCarts = UserBuilder.withProducts().result;
    const mockUpdateCart = UpdateCartDtoBuilder.defaultAll().result;
    const spyUserFind = jest
      .spyOn(stubUserService, 'findUserById')
      .mockReturnValueOnce('');

    test('should be return exception when user wrong', async () => {
      try {
        user = await cartService.updateCart(
          mockUserCarts._id.toString(),
          mockUpdateCart,
        );
      } catch (err) {
        expect(err).toStrictEqual(new BadRequestException(WRONG_USER));
      }
    });
  });

  describe('decrementAmountProducts', () => {
    const mockUser = UserBuilder.defaultAll().result;
    const mockUserProduct = UserBuilder.withOneProducts().result;
    const spyUserFind = jest
      .spyOn(stubUserService, 'findUserById')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(mockUserProduct)
      .mockReturnValueOnce(mockUserProduct)
      .mockReturnValueOnce(mockUserProduct);

    const cases = [
      {
        toString: () =>
          '1 should be should be return exception when user wrong',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd38d',
        expected: new BadRequestException(WRONG_USER),
      },
      {
        toString: () =>
          '2 should be should be return exception when  product wrong',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd381',
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () =>
          '3 should be should be return exception when then product not found in carts',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd39d',
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () => '4 should be call update user with mockUser',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd38d',
        expected: mockUser,
      },
    ];

    test.each(cases)('%s', async ({ id, productId, expected }) => {
      try {
        await cartService.decrementAmountProductInCart(id, productId);

        expect(stubUserService.updateUser).toBeCalledWith(id, expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('incrementAmountProducts', () => {
    const mockUser = UserBuilder.defaultAll().result;
    const mockUserProduct = UserBuilder.withOneProducts().result;
    const mockUserBigAmountProduct = UserBuilder.withProductsBigAmount().result;
    const mockProductIncrement = UserBuilder.withOneProductsIcrement().result;
    const spyUserFind = jest
      .spyOn(stubUserService, 'findUserById')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(mockUserProduct)
      .mockReturnValueOnce(mockUserProduct)
      .mockReturnValueOnce(mockUserBigAmountProduct)
      .mockReturnValueOnce(mockUserProduct);

    const cases = [
      {
        toString: () =>
          '1 should be should be return exception when user wrong',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd38d',
        expected: new BadRequestException(WRONG_USER),
      },
      {
        toString: () =>
          '2 should be should be return exception when  product wrong',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd381',
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () =>
          '3 should be should be return exception when then product not found in carts',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd39d',
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () =>
          '4 should be should be return exception when then product amount smaller then amount in carts',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd38d',
        expected: new BadRequestException(WRONG_AMOUNT_PRODUCTS),
      },

      {
        toString: () => '5 should be call update user with mockUser',
        id: mockUser._id.toString(),
        productId: '63c686405af7f0e50eddd38d',
        expected: mockProductIncrement,
      },
    ];

    test.each(cases)('%s', async ({ id, productId, expected }) => {
      try {
        await cartService.incrementAmountProductInCart(id, productId);

        expect(stubUserService.updateUser).toBeCalledWith(id, expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('mergingUserCarts', () => {
    const mockUserOneProduct = UserBuilder.withOneProducts().result;
    const localCart: LocalCartType[] = [
      {
        productId: '63c686405af7f0e50eddd38d',
        amount: 1,
      },
    ];

    const localCartFewProducts: LocalCartType[] = [
      {
        productId: '63c686405af7f0e50eddd38d',
        amount: 1,
      },
      {
        productId: '5eb6e7e7e9b7f4194e000001',

        amount: 5,
      },
    ];

    const mockCart: CartType[] = [
      {
        productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
        cost: 1000,
        amount: 1,
      },
    ];
    const userCart = [];
    const userCartWithProducts = mockUserOneProduct.carts;
    const mockCartProd: CartType[] = [
      {
        productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
        amount: 2,
        cost: 1000,
      },
      {
        productId: new Types.ObjectId('5eb6e7e7e9b7f4194e000001'),
        amount: 1,
        cost: 1000,
      },
    ];

    const cases = [
      {
        toString: () =>
          '1 should be should be return exception when  product wrong',
        smallCart: userCart,
        bigCart: localCart,
        expected: new BadRequestException(WRONG_PRODUCT),
      },
      {
        toString: () => '2 should be should be return mockCart',
        smallCart: userCart,
        bigCart: localCart,
        expected: mockCart,
      },
      {
        toString: () => '3 should be should be return mockCartProd',
        smallCart: userCartWithProducts,
        bigCart: localCartFewProducts,
        expected: mockCartProd,
      },
    ];

    test.each(cases)('%s', async ({ smallCart, bigCart, expected }) => {
      try {
        const result = await cartService.mergingUserCarts(smallCart, bigCart);
        expect(result).toEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });
});
