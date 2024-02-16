import { IUser } from '../interfaces';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonDto } from './create-person.dto';

export class CreateUserDto implements Partial<IUser> {
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;
}
