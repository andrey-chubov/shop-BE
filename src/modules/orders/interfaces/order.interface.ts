import { Types } from 'mongoose';
import { CartType } from '../../../shared/types/cartType';

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  carts: Array<CartType>;
  createdAt: Date;
  quantity: number;
  costOrder: number;
  address: string;
}
