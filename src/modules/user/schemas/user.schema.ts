import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson, IUser } from '../interfaces';
import { PersonSchema } from './person.schema';
import { genSalt, hash } from 'bcrypt';
import { UserRoleEnum } from '../enums';

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

  @Prop({
    type: String,
    enum: [UserRoleEnum.ADMIN, UserRoleEnum.CLIENT],
    default: UserRoleEnum.CLIENT,
    required: true,
    length: 11,
  })
  role: UserRoleEnum;

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

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update: any = this.getUpdate();

  if (update.password) {
    const salt = await genSalt();
    update.password = await hash(update.password, salt);
  }

  next();
});
