import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from '../keys';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { UserRoleEnum } from '@src/modules/user/enums';

/**
 * Decorador que permite verificar la autenticacion segun un rol
 *
 * @constructor
 */
export function Auth(...roles: UserRoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
