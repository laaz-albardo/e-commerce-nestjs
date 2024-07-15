import { Transformer } from '@src/shared';
import { IUser } from '../interfaces';
import { PersonTransformer } from './person.transformer';

export class UserTransformer extends Transformer {
  private readonly personTransformer: PersonTransformer;

  constructor() {
    super();
    this.personTransformer = new PersonTransformer();
  }

  public async transform(user: IUser): Promise<Partial<IUser>> {
    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      person: await this.validate(user.person, this.personTransformer),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
