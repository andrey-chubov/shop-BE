import { Types } from 'mongoose';
import { IOrder } from '../../src/modules/orders/interfaces/order.interface';
import { Orders } from '../../src/modules/orders/model/orders-model';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class OrdersBuilder {
  public static defaultAll(): InjectionFixtureBuilder<IOrder> {
    return new InjectionFixtureBuilder(new Orders())
      .with({ _id: new Types.ObjectId('7eb6e7e7e9b7f4194e000001') })
      .with({ userId: new Types.ObjectId('4eb6e7e7e9b7f4194e000001') })
      .with({
        carts: [
          {
            productId: new Types.ObjectId('5eb6e7e7e9b7f4194e000001'),
            cost: 1000,
            amount: 5,
          },
        ],
      })
      .with({ createdAt: new Date('2023-01-17T10:47:48.179+00:00') })
      .with({ quantity: 5 })
      .with({ costOrder: 5000 })
      .with({ address: 'test test' });
  }
}
