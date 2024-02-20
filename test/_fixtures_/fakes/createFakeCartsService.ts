import { CartsService } from '../../../src/modules/carts/carts.service';

export const createFakeCartsService = (): Record<
  keyof CartsService,
  jest.Mock
> => ({
  toggleUserCarts: jest.fn(),
  incrementAmountProductInCart: jest.fn(),
  decrementAmountProductInCart: jest.fn(),
  clearCart: jest.fn(),
  updateCart: jest.fn(),
  mergingUserCarts: jest.fn(),
  getProductWithNewAmount: jest.fn(),
});
