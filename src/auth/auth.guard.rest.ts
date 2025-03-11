import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

import { ConfigService } from '../config/config.service';
import type { AuthenticatedRequest } from '../shared/types';

@Injectable()
export class AuthGuardRest implements CanActivate {
  readonly #jwtService: JwtService;
  readonly #configService: ConfigService;
  constructor(jwtService: JwtService, configService: ConfigService) {
    this.#jwtService = jwtService;
    this.#configService = configService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = AuthService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token attached');
    }
    try {
      request.user = await this.#jwtService.verifyAsync(token, {
        secret: this.#configService.getAuthenticationConfig().JWT_SECRET,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException();
    }

    return true;
  }
}
