import { IPerson } from '../interfaces';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePersonDto implements IPerson {
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z ]+$/i, { message: 'fullName must be a string of letters' })
  fullName: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phoneNumber?: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  codePostal: string;

  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^[a-z ]+$/i, { message: 'country must be a string of letters' })
  country: string;
}
