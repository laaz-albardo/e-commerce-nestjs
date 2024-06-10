import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ICategory } from '../interfaces';
import { Transform } from 'class-transformer';

export class CreateCategoryDto implements ICategory {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform(({ value }) => String(value.toLowerCase()), { toClassOnly: true })
  name: string;
}
