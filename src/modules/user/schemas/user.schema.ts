import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson, IUser } from '../interfaces';
import { PersonSchema } from './person.schema';
import { genSalt, hash } from 'bcrypt';

@Schema({ timestamps: true })
export class User implements Partial<IUser> {
  @Prop({
    type: String,
    length: 50,
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, length: 50, required: true })
  password: string;

  @Prop({ type: PersonSchema, required: true })
  person: IPerson;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }

  next();
});
