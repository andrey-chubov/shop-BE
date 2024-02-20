import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ICategory } from '../interfaces/category.interface';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema()
export class Categories implements ICategory {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true })
  image: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
