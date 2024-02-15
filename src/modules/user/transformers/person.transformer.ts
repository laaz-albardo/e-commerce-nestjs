import { Transformer } from 'src/shared';
import { IPerson } from '../interfaces';

export class PersonTransformer extends Transformer {
  constructor() {
    super();
  }

  public async transform(person: IPerson): Promise<IPerson> {
    return {
      fullName: person.fullName,
      phoneNumber: person?.phoneNumber,
      codePostal: person.codePostal,
      country: person.country,
    };
  }
}
