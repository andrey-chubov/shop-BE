import { Types } from 'mongoose';
import { CartType } from '../../../shared/types/cartType';

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isAdmin: boolean;
  refreshToken: string;
  favorites: Array<Types.ObjectId>;
  carts: Array<CartType>;
}
