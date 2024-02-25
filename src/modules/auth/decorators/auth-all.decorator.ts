import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from '../keys';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { UserRoleEnum } from '@src/modules/user/enums';

/**
 * Decorador que permite verificar la autenticacion para todos los roles
 *
 * @constructor
 */
export function AuthAll() {
  const roles = [UserRoleEnum.ADMIN, UserRoleEnum.CLIENT];
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
