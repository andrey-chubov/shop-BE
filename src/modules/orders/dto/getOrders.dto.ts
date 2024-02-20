import { IOrder } from '../interfaces/order.interface';

export class GetOrdersDto {
  ordersArray: IOrder[];
  paginationCount: number;
}
