import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CartType } from '../../../shared/types/cartType';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: '' })
  refreshToken: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }])
  favorites: Array<Types.ObjectId>;

  @Prop([
    {
      cost: Number,
      amount: Number,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    },
  ])
  carts: Array<CartType>;
}

export const UserSchema = SchemaFactory.createForClass(User);
