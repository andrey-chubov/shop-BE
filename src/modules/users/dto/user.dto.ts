import { Types } from 'mongoose';
import { User, UserDocument } from '../model/user-model';
import { CartType } from '../../../shared/types/cartType';

export class UserDto {
  id: string;
  email: string;
  isAdmin: boolean;
  favorites: Types.ObjectId[];
  carts: Array<CartType>;

  constructor(model: User) {
    this.id = model._id.toString();
    this.email = model.email;
    this.isAdmin = model.isAdmin;
    this.favorites = model.favorites;
    this.carts = model.carts;
  }
}
