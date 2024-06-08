import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IFile } from '../interfaces';

@Schema({ autoCreate: false, autoIndex: false })
export class File implements IFile {
  @Prop({ type: String, required: true, unique: true })
  route: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
