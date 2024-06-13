import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from '../interfaces';
import { Category, ICategory } from '@src/modules/category';
import { FileSchema, IFile } from '@src/modules/file';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({ type: String, required: true, length: 100, index: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  enable: boolean;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: ICategory;

  @Prop({ type: [{ type: FileSchema, required: false }] })
  files?: IFile[] | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
