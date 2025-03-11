import type { Request } from 'express';

import { USER_ROLE } from './const';

export interface AuthenticatedRequest extends Request {
  user?: { role?: keyof typeof USER_ROLE };
}

export interface GraphqlContext {
  req: Request;
  user?: { role?: keyof typeof USER_ROLE };
}
