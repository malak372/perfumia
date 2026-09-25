import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class StorageService {
  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  async uploadFile(params: {
    bucket: string;
    path: string;
    buffer: Buffer;
    contentType: string;
    upsert?: boolean;
  }) {
    const {
      bucket,
      path,
      buffer,
      contentType,
      upsert = false,
    } = params;

    const {
      data,
      error,
    } =
      await this.supabase.adminClient
        .storage
        .from(bucket)
        .upload(
          path,
          buffer,
          {
            contentType,
            upsert,
          },
        );

    if (error) {
      throw new BadRequestException(
        error.message,
      );
    }

    return data;
  }

  async removeFile(
    bucket: string,
    path: string,
  ) {
    const {
      data,
      error,
    } =
      await this.supabase.adminClient
        .storage
        .from(bucket)
        .remove([
          path,
        ]);

    if (error) {
      throw new BadRequestException(
        error.message,
      );
    }

    return data;
  }

  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600,
  ) {
    const {
      data,
      error,
    } =
      await this.supabase.adminClient
        .storage
        .from(bucket)
        .createSignedUrl(
          path,
          expiresIn,
        );

    if (error) {
      throw new BadRequestException(
        error.message,
      );
    }

    return data;
  }

  getPublicUrl(
    bucket: string,
    path: string,
  ) {
    const {
      data,
    } =
      this.supabase.adminClient
        .storage
        .from(bucket)
        .getPublicUrl(path);

    return data;
  }
}