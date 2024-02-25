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
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { IUser } from '../user';
import { LocalAuthGuard } from './guards';
import { AuthInterceptor, LoginInterceptor } from './interceptors';
import { AuthAll } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(LoginInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @AuthAll()
  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  singOut(@Res() res: Response) {
    res.send({ statusCode: res.statusCode, data: { token: '' } });
  }

  @AuthAll()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  profile(@Req() req: Request) {
    return this.authService.profile(req.user as IUser);
  }
}
