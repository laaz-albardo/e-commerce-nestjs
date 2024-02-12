import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson, IUser } from '../interfaces';
import { PersonSchema } from './person.schema';

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ type: String, length: 50, required: true })
  email: string;

  @Prop({ type: String, length: 50, required: true })
  password: string;

  @Prop({ type: PersonSchema, required: true })
  person: IPerson;
}

export const UserShema = SchemaFactory.createForClass(User);
