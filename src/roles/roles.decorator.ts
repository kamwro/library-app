import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { USER_ROLE } from '../shared/const';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (keyof typeof USER_ROLE)[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
