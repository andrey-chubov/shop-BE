import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { createFakeOrderRepository } from '../../_fixtures_/fakes/createFakeOrderRepository';
import { OrdersService } from '../../../src/modules/orders/orders.service';
import { createFakeProductService } from '../../_fixtures_/fakes/createFakeProductService';
import { createFakeCartsService } from '../../_fixtures_/fakes/createFakeCartsService';
import { createFakeUserService } from '../../_fixtures_/fakes/createFakeUserService';
import { OrdersRepository } from '../../../src/modules/orders/orders.repository';
import { ProductsService } from '../../../src/modules/product/products.service';
import { UsersService } from '../../../src/modules/users/users.service';
import { CartsService } from '../../../src/modules/carts/carts.service';
import { CartType } from '../../../src/shared/types/cartType';
import { WRONG_AMOUNT_PRODUCTS } from '../../../src/shared/errors/errorMessages';
import { ProductsBuilder } from '../../_fixtures_/productBuilder';
import config from '../../../src/config';
import { UserBuilder } from '../../_fixtures_/userBuilder';
import { GetOrdersDto } from '../../../src/modules/orders/dto/getOrders.dto';
import { GetOrdersDtoBuilder } from '../../_fixtures_/getOrdersDtoBuilder';
import { IOrder } from '../../../src/modules/orders/interfaces/order.interface';
import { OrdersBuilder } from '../../_fixtures_/orderBuilder';

describe('OrderService', () => {
  let orderService: OrdersService;
  const stubRepository = createFakeOrderRepository();
  const stubProductService = createFakeProductService();
  const stubCartService = createFakeCartsService();
  const stubUserService = createFakeUserService();

  const mockOrderProduct: CartType = {
    productId: new Types.ObjectId('63c686405af7f0e50eddd38d'),
    cost: 1000,
    amount: 10,
  };
  const mockProduct = ProductsBuilder.defaultAll().result;
  const mockProductSmallAmount = ProductsBuilder.smallAmount().result;
  const mockProductNullAmount = ProductsBuilder.setNullAmount().result;
  const mockUser = UserBuilder.withProducts().result;
  const mockUserSmallCarts = UserBuilder.withProductsSmallAmount().result;
  const mockUserBigCarts = UserBuilder.withProductsBigAmount().result;
  const mockGetOrderDto = GetOrdersDtoBuilder.defaultAll().result;
  const mockOrder = OrdersBuilder.defaultAll().result;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [OrdersService],
      providers: [
        {
          provide: OrdersRepository,
          useValue: stubRepository,
        },
        {
          provide: ProductsService,
          useValue: stubProductService,
        },
        {
          provide: UsersService,
          useValue: stubUserService,
        },
        {
          provide: CartsService,
          useValue: stubCartService,
        },
      ],
    }).compile();

    orderService = moduleRef.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('assertProductEnough', () => {
    const cases = [
      {
        toString: () => '1 if amount not wrong return nothing',
        orderProduct: mockOrderProduct,
        product: mockProduct,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when amount wrong',
        orderProduct: mockOrderProduct,
        product: mockProductSmallAmount,
        expected: new BadRequestException(WRONG_AMOUNT_PRODUCTS),
      },
    ];

    test.each(cases)('%s', ({ orderProduct, product, expected }) => {
      try {
        const result = orderService.assertProductEnough(orderProduct, product);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('getUserOrders', () => {
    describe('when findByUserId called', () => {
      const limit = config.defaultLimitPagination;
      const page = config.defaultPagePagination;
      let userOrders: GetOrdersDto;

      beforeEach(async () => {
        userOrders = await orderService.getUserOrders(
          mockUser._id.toString(),
          limit,
          page,
        );
      });

      test('then it should call ordersRepository', () => {
        expect(stubRepository.findByUserId).toBeCalledWith(
          mockUser._id.toString(),
          limit,
          page,
        );
      });

      test('then is should be return arrays Orders', () => {
        expect(userOrders).toEqual(mockGetOrderDto);
      });
    });
  });

  describe('getAllOrders', () => {
    describe('when find called', () => {
      const limit = config.defaultLimitPagination;
      const page = config.defaultPagePagination;
      let userOrders: GetOrdersDto;

      beforeEach(async () => {
        userOrders = await orderService.getAllOrders(limit, page);
      });

      test('then it should call ordersRepository', () => {
        expect(stubRepository.find).toBeCalledWith(limit, page);
      });

      test('then is should be return arrays Orders', () => {
        expect(userOrders).toEqual(mockGetOrderDto);
      });
    });
  });

  describe('validateAmountProducts', () => {
    const cases = [
      {
        toString: () => '1 if amount not wrong return nothing',
        user: mockUser,
        expected: undefined,
      },
      {
        toString: () => '2 should be return exception, when amount not enough',
        user: mockUserBigCarts,
        expected: new BadRequestException(WRONG_AMOUNT_PRODUCTS),
      },
    ];

    test.each(cases)('%s', async ({ user, expected }) => {
      try {
        const result = await orderService.validateAmountProducts(user);
        expect(result).toStrictEqual(expected);
      } catch (error) {
        expect(error).toStrictEqual(expected);
      }
    });
  });

  describe('createOrder', () => {
    let order: IOrder;
    const spyUserService = jest
      .spyOn(stubUserService, 'findUserById')
      .mockImplementation((): any => mockUserSmallCarts);
    beforeEach(async () => {
      order = await orderService.createOrder(
        mockUserSmallCarts._id.toString(),
        'test test',
      );
    });
    test('it should be return mockOrder ', () => {
      expect(stubUserService.findUserById).toBeCalledWith(
        mockUserSmallCarts._id.toString(),
      );
      expect(stubUserService.findUserById).toBeCalledWith(
        mockUserSmallCarts._id.toString(),
      );
      expect(stubRepository.create).toBeCalledWith(
        mockUserSmallCarts._id.toString(),
        mockUserSmallCarts.carts,
        5,
        5000,
        'test test',
      );
      expect(order).toEqual(mockOrder);
    });
  });

  describe('decrementAmountProducts', () => {
    beforeEach(async () => {
      await orderService.decrementAmountProducts(mockUserSmallCarts);
    });

    test('then it should call productService getProductById and  then updateProduct with 0 amount', () => {
      expect(stubProductService.getProductById).toBeCalledWith(
        mockUserSmallCarts.carts[0].productId.toString(),
      );
      expect(stubProductService.updateProduct).toBeCalledWith(
        mockProductNullAmount._id.toString(),
        mockProductNullAmount,
      );
    });
  });
});
