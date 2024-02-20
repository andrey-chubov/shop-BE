import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
import { Categories } from '../../../modules/categories/model/categories-model';

export type ProductsDocument = HydratedDocument<Products>;

@Schema({ timestamps: true })
export class Products implements IProduct {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: mongoose.now() })
  createdAt: Date;

  @Prop({ default: mongoose.now() })
  updatedAt: Date;

  @Prop({ required: true })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' })
  categoryId: Categories;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
