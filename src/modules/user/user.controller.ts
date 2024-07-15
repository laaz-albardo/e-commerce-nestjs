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
  Req,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { UserService } from './user.service';
import { Auth, AuthAll } from '@src/modules/auth';
import { UserRoleEnum } from './enums';
import { FastifyRequest } from 'fastify';
import { ParseMongoIdPipe } from '@src/shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('pagination', new ParseBoolPipe({ optional: true }))
    pagination?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.userService.findAll(pagination, page, limit);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseMongoIdPipe()) id: string) {
    return this.userService.findOneById(id);
  }

  @AuthAll()
  @Patch()
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Req() req: FastifyRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req['user']._id, updateUserDto);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.CLIENT)
  @Patch('update-password')
  @HttpCode(HttpStatus.ACCEPTED)
  updatePassword(
    @Req() req: FastifyRequest,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(
      req['user']._id,
      updateUserPasswordDto,
    );
  }

  @Auth(UserRoleEnum.CLIENT)
  @Delete('delete-me')
  @HttpCode(HttpStatus.ACCEPTED)
  removeClient(@Req() req: FastifyRequest) {
    return this.userService.remove(req['user']._id);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('id', new ParseMongoIdPipe()) id: string) {
    return this.userService.remove(id);
  }
}
