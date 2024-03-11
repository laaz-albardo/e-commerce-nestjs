import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { Auth, AuthAll } from '@src/modules/auth';
import { UserRoleEnum } from './enums';
import { FastifyRequest } from 'fastify';

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
  findAll() {
    return this.userService.findAll();
  }

  @Auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @AuthAll()
  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Req() req: FastifyRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req['user']._id, updateUserDto);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
