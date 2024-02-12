import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson } from '../interfaces';

@Schema()
export class Person implements IPerson {
  @Prop({ type: String, length: 100, required: true })
  fullName: string;

  @Prop({ type: String, length: 20, required: false })
  phoneNumber?: string;

  @Prop({ type: String, length: 10, required: true })
  codePostal: string;

  @Prop({ type: String, length: 20, required: true })
  country: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
