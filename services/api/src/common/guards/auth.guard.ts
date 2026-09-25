import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service.js';
import { SupabaseService } from '../../supabase/supabase.service.js';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class AuthGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,

    private readonly supabase: SupabaseService,

    private readonly prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic =
      this.reflector
        .getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );

    if (isPublic) {
      return true;
    }

    const request =
      context
        .switchToHttp()
        .getRequest<any>();

    const authorization =
      request.headers
        .authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header is missing',
      );
    }

    const [
      type,
      token,
    ] =
      authorization.split(
        ' ',
      );

    if (
      type !== 'Bearer' ||
      !token
    ) {
      throw new UnauthorizedException(
        'Invalid Authorization header',
      );
    }

    const authUser =
      await this.supabase
        .verifyAccessToken(
          token,
        );

    if (
      !authUser
        .email_confirmed_at
    ) {
      throw new ForbiddenException(
        'Email is not verified',
      );
    }

    const profile =
      await this.prisma.db.orm.public.User.first({
        id:
          authUser.id,
      });

    if (
      !profile ||
      profile.deletedAt
    ) {
      throw new UnauthorizedException(
        'User profile not found',
      );
    }

    request.user =
      profile;

    return true;
  }
}