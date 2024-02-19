import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { IUser } from '../user';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { AuthInterceptor, LoginInterceptor } from './transformers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(LoginInterceptor)
  @Post('login')
  @HttpCode(201)
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  // @AuthAll()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(202)
  singOut(@Res() res: Response) {
    res.send({ statusCode: res.statusCode, data: { token: '' } });
  }

  // @AuthAll()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @HttpCode(200)
  @Get('me')
  profile(@Req() req: Request) {
    return this.authService.profile(req.user as IUser);
  }
}
