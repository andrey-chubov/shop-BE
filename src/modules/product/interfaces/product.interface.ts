import { Types } from 'mongoose';
import { ICategory } from '../../../modules/categories/interfaces/category.interface';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  productId: string;
  cost: number;
  amount: number;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  categoryId: ICategory;
}
