import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly publishableKey: string;

  readonly adminClient: SupabaseClient;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.url =
      this.config.getOrThrow<string>('SUPABASE_URL');

    this.publishableKey =
      this.config.getOrThrow<string>(
        'SUPABASE_PUBLISHABLE_KEY',
      );

    const secretKey =
      this.config.getOrThrow<string>(
        'SUPABASE_SECRET_KEY',
      );

    this.adminClient = createClient(
      this.url,
      secretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  createPublicClient() {
    return createClient(
      this.url,
      this.publishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  async verifyAccessToken(token: string) {
    const client = this.createPublicClient();

    const {
      data: { user },
      error,
    } = await client.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException(
        'Invalid or expired access token',
      );
    }

    return user;
  }
}