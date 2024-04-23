import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICategory } from '../interfaces';

@Schema({ timestamps: true })
export class Category implements ICategory {
  @Prop({
    type: String,
    length: 50,
    required: true,
    unique: true,
    index: true,
  })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
