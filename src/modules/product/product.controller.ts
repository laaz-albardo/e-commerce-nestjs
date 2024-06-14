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
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
