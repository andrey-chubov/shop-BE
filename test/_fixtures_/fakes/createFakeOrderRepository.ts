import { OrdersRepository } from '../../../src/modules/orders/orders.repository';
import { GetOrdersDtoBuilder } from '../getOrdersDtoBuilder';
import { OrdersBuilder } from '../orderBuilder';

export const createFakeOrderRepository = (): Record<
  keyof OrdersRepository,
  jest.Mock
> => ({
  find: jest.fn().mockReturnValue(mockGetOrderDto),
  findByUserId: jest.fn().mockReturnValue(mockGetOrderDto),
  create: jest.fn().mockReturnValue(mockOrder),
});

const mockOrder = OrdersBuilder.defaultAll().result;
const mockGetOrderDto = GetOrdersDtoBuilder.defaultAll().result;
