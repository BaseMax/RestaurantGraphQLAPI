import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../users/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const c = ctx.getContext();
    if (this.isOptional(ctx) && !c.req.headers.authorization) {
      return true;
    }
    const token = c.req.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('invalid token');
    }
    const payload = this.validateToken(token);
    c.req.user = payload;
    if (this.getMinRole(ctx) > payload.role) {
      throw new ForbiddenException('permission denied');
    }
    return true;
  }
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new ForbiddenException('invalid token');
    }
  }
  getMinRole(ctx: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride('MIN_ROLE', [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || Role.user
    );
  }
  isOptional(ctx: ExecutionContext) {
    return this.reflector.getAllAndOverride('IS_OPTIONAL_AUTH', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }
}
