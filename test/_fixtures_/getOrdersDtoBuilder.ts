import { GetOrdersDto } from '../../src/modules/orders/dto/getOrders.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';
import { OrdersBuilder } from './orderBuilder';

export class GetOrdersDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<GetOrdersDto> {
    return new InjectionFixtureBuilder(new GetOrdersDto())
      .with({
        ordersArray: [mockOrder],
      })
      .with({ paginationCount: 1 });
  }
}

const mockOrder = OrdersBuilder.defaultAll().result;
