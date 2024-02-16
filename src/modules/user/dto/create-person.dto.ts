import { IPerson } from '../interfaces';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePersonDto implements IPerson {
  @Matches(/^[a-z ]+$/i, { message: 'fullName must be a string of letters' })
  @MaxLength(100)
  fullName: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phoneNumber?: string | null;

  @IsString()
  @MaxLength(10)
  codePostal: string;

  @Matches(/^[a-z ]+$/i, { message: 'country must be a string of letters' })
  @MaxLength(20)
  country: string;
}
