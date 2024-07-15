import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from '../user';
import { LocalAuthGuard } from './guards';
import {
  AuthInterceptor,
  LoginInterceptor,
  LogoutInterceptor,
} from './interceptors';
import { AuthAll } from './decorators';
import { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(LoginInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Req() req: FastifyRequest) {
    return this.authService.login(req['user']);
  }

  @AuthAll()
  @UseInterceptors(LogoutInterceptor)
  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  singOut() {}

  @AuthAll()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  profile(@Req() req: FastifyRequest) {
    return this.authService.profile(req['user'] as IUser);
  }
}
