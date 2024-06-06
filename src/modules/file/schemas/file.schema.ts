import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IFile } from '../interfaces';

export class File implements IFile {
  @Prop({ type: String, required: true, unique: true })
  route: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
