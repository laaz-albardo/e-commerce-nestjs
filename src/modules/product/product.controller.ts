import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  Query,
  ParseFloatPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { MulterMultiStorage } from '@src/config';
import { Auth } from '../auth';
import { UserRoleEnum } from '../user';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Post()
  @UseInterceptors(MulterMultiStorage)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.create(createProductDto, images);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('name') name?: string,
    @Query('minPrice', new ParseFloatPipe({ optional: true }))
    minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true }))
    maxPrice?: number,
    @Query('category') category?: string,
    @Query('orderByName', new ParseIntPipe({ optional: true }))
    orderByName?: number,
    @Query('orderByPrice', new ParseIntPipe({ optional: true }))
    orderByPrice?: number,
    @Query('orderByCreatedAt', new ParseIntPipe({ optional: true }))
    orderByCreatedAt?: number,
  ) {
    return this.productService.findAll(
      name,
      minPrice,
      maxPrice,
      category,
      orderByName,
      orderByPrice,
      orderByCreatedAt,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOneById(id);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Patch(':id')
  @UseInterceptors(MulterMultiStorage)
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.update(id, updateProductDto, images);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
