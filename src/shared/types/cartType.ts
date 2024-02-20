import { Types } from 'mongoose';

export type CartType = {
  productId: Types.ObjectId;
  cost: number;
  amount: number;
};
