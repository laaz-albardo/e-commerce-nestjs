import {
  isArray,
  IsArray,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IProduct } from '../interfaces';
import { Transform } from 'class-transformer';
import { IFile } from '@src/modules/file';
import { ICategory } from '@src/modules/category';
import { ProductShirtSize } from '../enums';

export class CreateProductDto implements IProduct {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => String(value.toLowerCase()), { toClassOnly: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(254)
  @Transform(({ value }) => String(value.toLowerCase()), { toClassOnly: true })
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  stock: number;

  @IsOptional()
  @IsArray()
  @IsEnum(ProductShirtSize, { each: true })
  @Transform(({ value }) => (isArray(value) ? value : Array(value)), {
    toClassOnly: true,
  })
  size?: ProductShirtSize[] | null;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  price: number;

  @IsNotEmpty()
  @IsBooleanString()
  @Transform(({ value }) => String(value), { toClassOnly: true })
  enable: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }) => String(value), { toClassOnly: true })
  category: ICategory;

  @IsOptional()
  @IsArray()
  files?: IFile[] | null;
}
