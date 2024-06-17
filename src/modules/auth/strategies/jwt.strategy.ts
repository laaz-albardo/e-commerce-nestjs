import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserUseCase } from '@src/modules/user';
import { IJWTPayload } from '../interfaces';
import { errorInstaceOf } from '@src/shared';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  private static extractJWTFromCookie(req: FastifyRequest): string | null {
    if (req.cookies && req.cookies.token && req.cookies.token.length > 0) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: IJWTPayload) {
    try {
      this.logger.log('auth user token...');

      const user = await this.getUserUseCase.getUserById(payload._id as string);

      if (!user) {
        throw new UnauthorizedException();
      }

      this.logger.log('auth user token successfully');

      return user;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
