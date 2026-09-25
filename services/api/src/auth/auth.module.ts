import {
  Module,
} from '@nestjs/common';

import { AuthController } from './auth.controller.js';

import { AuthService } from './auth.service.js';
import { AuthLockService } from './auth-lock.service.js';
import { GuestClaimService } from './guest-claim.service.js';

@Module({
  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    AuthLockService,
    GuestClaimService,
  ],

  exports: [
    AuthService,
    GuestClaimService,
  ],
})
export class AuthModule {}