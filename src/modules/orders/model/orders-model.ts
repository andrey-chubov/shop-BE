import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CartType } from '../../../shared/types/cartType';
import { IOrder } from '../interfaces/order.interface';

export type OrdersDocument = HydratedDocument<Orders>;

@Schema({ timestamps: true })
export class Orders implements IOrder {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop([
    {
      cost: Number,
      amount: Number,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    },
  ])
  carts: Array<CartType>;

  @Prop({ default: mongoose.now() })
  createdAt: Date;

  @Prop()
  quantity: number;

  @Prop()
  costOrder: number;

  @Prop()
  address: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
