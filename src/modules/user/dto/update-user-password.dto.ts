import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserPasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
