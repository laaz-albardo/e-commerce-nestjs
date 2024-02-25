import { IUser } from '../interfaces';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonDto } from './create-person.dto';
import { UserRoleEnum } from '../enums';

export class CreateUserDto implements Partial<IUser> {
  @IsEmail()
  @MaxLength(50)
  email: string;

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

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;
}
