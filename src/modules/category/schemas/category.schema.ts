import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICategory } from '../interfaces';
import { FileSchema, IFile } from '@src/modules/file';

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

  @Prop({ type: FileSchema })
  file: IFile;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
