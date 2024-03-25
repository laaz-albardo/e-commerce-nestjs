import { IUser } from '../interfaces';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreatePersonDto } from './create-person.dto';

export class CreateUserDto implements Partial<IUser> {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/[A-Z]/, {
    message: 'password must have at least one capital letter',
  })
  @Matches(/[a-z]/, {
    message: 'password must have at least one lowercase letter',
  })
  @Matches(/\d/, {
    message: 'password must have at least one number',
  })
  password: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;
}
