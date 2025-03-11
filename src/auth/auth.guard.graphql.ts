import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ConfigService } from '../config/config.service';
import { GraphqlContext } from '../shared/types';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardGraphQL implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<GraphqlContext>().req;
    const token = AuthService.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getAuthenticationConfig().JWT_SECRET,
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