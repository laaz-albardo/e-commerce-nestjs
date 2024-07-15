import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Auth } from '@src/modules/auth';
import { UserRoleEnum } from '@src/modules/user';
import { MulterStorage } from '@src/config';
import { ParseMongoIdPipe } from '@src/shared';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Post()
  @UseInterceptors(MulterStorage)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('pagination', new ParseBoolPipe({ optional: true }))
    pagination?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoryService.findAll(pagination, page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseMongoIdPipe()) id: string) {
    return this.categoryService.findOneById(id);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Patch(':id')
  @UseInterceptors(MulterStorage)
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('id', new ParseMongoIdPipe()) id: string) {
    return this.categoryService.remove(id);
  }
}
