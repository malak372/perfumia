import {
  Module,
} from '@nestjs/common';

import {
  APP_GUARD,
} from '@nestjs/core';

import {
  ConfigModule,
} from '@nestjs/config';

import { AppController } from './app.controller.js';

import { validateEnv } from './config/env.validation.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { SupabaseModule } from './supabase/supabase.module.js';

import { AuthModule } from './auth/auth.module.js';

import { StorageModule } from './storage/storage.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';

import { AuthGuard } from './common/guards/auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),

    PrismaModule,

    SupabaseModule,

    AuthModule,

    StorageModule,

    RealtimeModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}