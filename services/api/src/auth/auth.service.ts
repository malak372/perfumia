import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';

import { AuthLockService } from './auth-lock.service.js';
import { GuestClaimService } from './guest-claim.service.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly supabase: SupabaseService,

    private readonly authLock: AuthLockService,

    private readonly guestClaim: GuestClaimService,
  ) {}

  async register(
    dto: RegisterDto,
  ) {
    const email =
      dto.email
        .trim()
        .toLowerCase();

    const client =
      this.supabase.createPublicClient();

    /*
     * Avoid calling signUp repeatedly
     * for a profile we already know.
     */
    const existingProfile =
      await this.prisma.db.orm.public.User.first({
        email,
      });

    if (existingProfile) {
      if (
        existingProfile.deletedAt
      ) {
        throw new BadRequestException(
          'Unable to register this account',
        );
      }

      const {
        data:
          existingAuthData,
        error:
          existingAuthError,
      } =
        await this.supabase.adminClient.auth.admin
          .getUserById(
            existingProfile.id,
          );

      if (
        !existingAuthError &&
        existingAuthData.user
          ?.email_confirmed_at
      ) {
        throw new ConflictException(
          'Account already exists. Please sign in.',
        );
      }

      /*
       * Existing but not verified:
       * resend the signup code.
       */
      const {
        error:
          resendError,
      } =
        await client.auth.resend({
          type: 'signup',
          email,
        });

      if (resendError) {
        throw new BadRequestException(
          resendError.message,
        );
      }

      await this.prisma.db.orm.public.User
        .where({
          id:
            existingProfile.id,
        })
        .update({
          name:
            dto.name,
        });

      return {
        user: {
          ...existingProfile,
          name:
            dto.name,
        },

        accessToken: null,
        refreshToken: null,

        emailConfirmationRequired:
          true,

        message:
          'Verification code sent.',
      };
    }

    const {
      data,
      error,
    } =
      await client.auth.signUp({
        email,
        password:
          dto.password,

        options: {
          data: {
            name:
              dto.name,
          },
        },
      });

    if (
      error ||
      !data.user
    ) {
      throw new BadRequestException(
        error?.message ??
          'Unable to create user',
      );
    }

    const profile =
      await this.prisma.db.orm.public.User.create({
        id:
          data.user.id,

        email,

        name:
          dto.name,

        role:
          'USER',
      });

    /*
     * Normally when email confirmation
     * is enabled, session will be null.
     *
     * This branch also supports development
     * environments where confirmations
     * may temporarily be disabled.
     */
    let guestHistoryLinked:
      | {
          ordersLinked: number;
          paymentsLinked: number;
          preferencesLinked: number;
        }
      | null = null;

    if (
      data.session &&
      data.user.email_confirmed_at
    ) {
      guestHistoryLinked =
        await this.guestClaim
          .claimByVerifiedEmail(
            profile.id,
            email,
          );
    }

    return {
      user:
        profile,

      accessToken:
        data.session
          ?.access_token ??
        null,

      refreshToken:
        data.session
          ?.refresh_token ??
        null,

      emailConfirmationRequired:
        !data.session,

      guestHistoryLinked,

      message:
        data.session
          ? 'Registration completed.'
          : 'Registration created. Check your email for the verification code.',
    };
  }

  async verifyEmail(
    dto: VerifyEmailDto,
  ) {
    const email =
      dto.email
        .trim()
        .toLowerCase();

    const client =
      this.supabase.createPublicClient();

    const {
      data,
      error,
    } =
      await client.auth.verifyOtp({
        email,

        token:
          dto.code,

        type:
          'email',
      });

    if (
      error ||
      !data.user ||
      !data.session
    ) {
      throw new BadRequestException(
        'Invalid or expired verification code',
      );
    }

    let profile =
      await this.prisma.db.orm.public.User.first({
        id:
          data.user.id,
      });

    /*
     * Self-healing fallback:
     * normally profile already exists
     * because register() created it.
     */
    if (!profile) {
      const metadataName =
        typeof data.user
          .user_metadata?.[
          'name'
        ] === 'string'
          ? data.user
              .user_metadata[
              'name'
            ]
          : null;

      profile =
        await this.prisma.db.orm.public.User.create({
          id:
            data.user.id,

          email,

          name:
            metadataName,

          role:
            'USER',
        });
    }

    await this.authLock.reset(
      profile.id,
    );

    /*
     * SECURITY:
     *
     * Guest data is claimed ONLY
     * after email ownership is verified.
     */
    const guestHistoryLinked =
      await this.guestClaim
        .claimByVerifiedEmail(
          profile.id,
          email,
        );

    return {
      user:
        profile,

      accessToken:
        data.session
          .access_token,

      refreshToken:
        data.session
          .refresh_token,

      expiresAt:
        data.session
          .expires_at,

      guestHistoryLinked,

      message:
        'Email verified successfully.',
    };
  }

  async resendVerification(
    dto: ResendVerificationDto,
  ) {
    const email =
      dto.email
        .trim()
        .toLowerCase();

    const profile =
      await this.prisma.db.orm.public.User.first({
        email,
      });

    if (profile) {
      const {
        data,
      } =
        await this.supabase.adminClient.auth.admin
          .getUserById(
            profile.id,
          );

      if (
        data.user
          ?.email_confirmed_at
      ) {
        throw new BadRequestException(
          'Email is already verified',
        );
      }
    }

    const client =
      this.supabase.createPublicClient();

    const {
      error,
    } =
      await client.auth.resend({
        type:
          'signup',

        email,
      });

    if (error) {
      throw new BadRequestException(
        error.message,
      );
    }

    return {
      success: true,

      message:
        'Verification code sent.',
    };
  }

  async login(
    dto: LoginDto,
  ) {
    const email =
      dto.email
        .trim()
        .toLowerCase();

    const profileBeforeLogin =
      await this.prisma.db.orm.public.User.first({
        email,
      });

    if (
      profileBeforeLogin
        ?.deletedAt
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    /*
     * Check our progressive lock
     * BEFORE asking Supabase to login.
     */
    if (profileBeforeLogin) {
      this.authLock.assertNotLocked(
        profileBeforeLogin,
      );
    }

    const client =
      this.supabase.createPublicClient();

    const {
      data,
      error,
    } =
      await client.auth.signInWithPassword({
        email,
        password:
          dto.password,
      });

    if (error) {
      /*
       * Unverified email is not a
       * wrong-password attempt.
       */
      if (
        error.code ===
        'email_not_confirmed'
      ) {
        throw new ForbiddenException(
          'Email is not verified. Please verify your email first.',
        );
      }

      if (profileBeforeLogin) {
        await this.authLock
          .recordFailure(
            profileBeforeLogin,
          );
      }

      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (
      !data.user ||
      !data.session
    ) {
      if (profileBeforeLogin) {
        await this.authLock
          .recordFailure(
            profileBeforeLogin,
          );
      }

      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    let profile =
      await this.prisma.db.orm.public.User.first({
        id:
          data.user.id,
      });

    if (!profile) {
      const metadataName =
        typeof data.user
          .user_metadata?.[
          'name'
        ] === 'string'
          ? data.user
              .user_metadata[
              'name'
            ]
          : null;

      profile =
        await this.prisma.db.orm.public.User.create({
          id:
            data.user.id,

          email,

          name:
            metadataName,

          role:
            'USER',
        });
    }

    if (
      profile.deletedAt
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    /*
     * Successful login resets
     * progressive locking.
     */
    await this.authLock.reset(
      profile.id,
    );

    /*
     * signInWithPassword succeeds only
     * for the confirmed account when
     * Confirm email is enabled.
     *
     * Claiming here also fixes old guest
     * orders for existing users who were
     * created before this feature existed.
     */
    const guestHistoryLinked =
      await this.guestClaim
        .claimByVerifiedEmail(
          profile.id,
          email,
        );

    return {
      user:
        profile,

      accessToken:
        data.session
          .access_token,

      refreshToken:
        data.session
          .refresh_token,

      expiresAt:
        data.session
          .expires_at,

      guestHistoryLinked,
    };
  }

  async refresh(
    dto: RefreshTokenDto,
  ) {
    const client =
      this.supabase.createPublicClient();

    const {
      data,
      error,
    } =
      await client.auth.refreshSession({
        refresh_token:
          dto.refreshToken,
      });

    if (
      error ||
      !data.session
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    return {
      accessToken:
        data.session
          .access_token,

      refreshToken:
        data.session
          .refresh_token,

      expiresAt:
        data.session
          .expires_at,
    };
  }
}