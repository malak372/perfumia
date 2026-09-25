import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import {
  Temporal,
} from 'temporal-polyfill';

import { PrismaService } from '../prisma/prisma.service.js';

const FAILED_ATTEMPTS_BEFORE_LOCK = 5;

const LOCK_MINUTES = [
  1,
  5,
  15,
  30,
  60,
];

type LockableUser = {
  id: string;
  failedLoginAttempts: number;
  lockLevel: number;
  lockedUntil: unknown | null;
};

@Injectable()
export class AuthLockService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  assertNotLocked(
    user: LockableUser,
  ) {
    if (!user.lockedUntil) {
      return;
    }

    const lockedUntil =
      Temporal.Instant.from(
        String(
          user.lockedUntil,
        ),
      );

    const now =
      Temporal.Now.instant();

    const stillLocked =
      Temporal.Instant.compare(
        lockedUntil,
        now,
      ) > 0;

    if (!stillLocked) {
      return;
    }

    throw new BadRequestException(
      `Account temporarily locked until ${lockedUntil.toString()}`,
    );
  }

  async recordFailure(
    user: LockableUser,
  ) {
    const now =
      Temporal.Now.instant();

    const nextFailedAttempts =
      user.failedLoginAttempts + 1;

    /*
     * Not at the locking threshold yet.
     */
    if (
      nextFailedAttempts <
      FAILED_ATTEMPTS_BEFORE_LOCK
    ) {
      await this.prisma.db.orm.public.User
        .where({
          id: user.id,
        })
        .update({
          failedLoginAttempts:
            nextFailedAttempts,

          lastFailedLoginAt:
            now,

          // Old expired lock is no longer relevant.
          lockedUntil:
            null,
        });

      return {
        locked: false,
        failedLoginAttempts:
          nextFailedAttempts,
      };
    }

    /*
     * Threshold reached:
     *
     * lock 1 -> 1 min
     * lock 2 -> 5 min
     * lock 3 -> 15 min
     * lock 4 -> 30 min
     * lock 5+ -> 60 min
     */
    const nextLevel =
      Math.min(
        user.lockLevel + 1,
        LOCK_MINUTES.length,
      );

    const minutes =
      LOCK_MINUTES[
        nextLevel - 1
      ]!;

    const lockedUntil =
      now.add({
        minutes,
      });

    await this.prisma.db.orm.public.User
      .where({
        id: user.id,
      })
      .update({
        failedLoginAttempts: 0,

        lockLevel:
          nextLevel,

        lockedUntil,

        lastFailedLoginAt:
          now,
      });

    return {
      locked: true,
      lockLevel:
        nextLevel,
      lockMinutes:
        minutes,
      lockedUntil:
        lockedUntil.toString(),
    };
  }

  async reset(
    userId: string,
  ) {
    await this.prisma.db.orm.public.User
      .where({
        id: userId,
      })
      .update({
        failedLoginAttempts: 0,
        lockLevel: 0,
        lockedUntil: null,
        lastFailedLoginAt: null,
      });
  }
}