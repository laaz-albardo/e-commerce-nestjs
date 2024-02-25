import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../keys';
import { UserRoleEnum } from '@src/modules/user/enums/user-role.enum';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = () => requiredRoles.some((role) => user.role == role);

    if (user && user.role && hasRole()) {
      return true;
    } else {
      const err = new ForbiddenException('Permission denied');
      throw new CustomErrorException(err);
    }
  }
}
