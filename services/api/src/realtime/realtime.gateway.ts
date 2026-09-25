import 'dotenv/config';

import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import type {
  Server,
  Socket,
} from 'socket.io';

import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';

const allowedOrigins =
  (
    process.env[
      'CORS_ORIGINS'
    ] ??
    'http://localhost:5173'
  )
    .split(',')
    .map(
      (origin) =>
        origin.trim(),
    )
    .filter(Boolean);

@WebSocketGateway({
  namespace:
    '/realtime',

  cors: {
    origin:
      allowedOrigins,

    credentials:
      true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly supabase: SupabaseService,

    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(
    client: Socket,
  ) {
    try {
      /*
       * =================================================
       * 1. AUTHENTICATED USER / ADMIN
       * =================================================
       */

      const authToken =
        client.handshake
          .auth?.token;

      const authorizationHeader =
        client.handshake
          .headers
          .authorization;

      let token:
        | string
        | undefined;

      if (
        typeof authToken ===
          'string' &&
        authToken.length > 0
      ) {
        token =
          authToken;
      }

      if (
        !token &&
        typeof authorizationHeader ===
          'string'
      ) {
        const [
          type,
          bearerToken,
        ] =
          authorizationHeader
            .split(' ');

        if (
          type ===
            'Bearer' &&
          bearerToken
        ) {
          token =
            bearerToken;
        }
      }

      if (token) {
        const authUser =
          await this.supabase
            .verifyAccessToken(
              token,
            );

        if (
          !authUser
            .email_confirmed_at
        ) {
          client.disconnect();
          return;
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
          client.disconnect();
          return;
        }

        client.data.user =
          profile;

        await client.join(
          `user:${profile.id}`,
        );

        if (
          profile.role ===
          'ADMIN'
        ) {
          await client.join(
            'admins',
          );
        }

        return;
      }

      /*
       * =================================================
       * 2. GUEST
       * =================================================
       *
       * Guest connects using the secure
       * Order.trackingToken.
       */

      const trackingToken =
        client.handshake
          .auth
          ?.trackingToken;

      if (
        typeof trackingToken !==
          'string' ||
        trackingToken.length === 0
      ) {
        client.disconnect();
        return;
      }

      const order =
        await this.prisma.db.orm.public.Order.first({
          trackingToken,
        });

      /*
       * Once an order is claimed by
       * a registered user, the old
       * guest tracking connection
       * is no longer accepted.
       */
      if (
        !order ||
        order.userId
      ) {
        client.disconnect();
        return;
      }

      client.data
        .guestOrderId =
        order.id;

      await client.join(
        `order:${order.id}`,
      );
    } catch {
      client.disconnect();
    }
  }

  /*
   * Send to a logged-in user.
   */
  emitToUser(
    userId: string,
    event: string,
    payload: unknown,
  ) {
    this.server
      .to(
        `user:${userId}`,
      )
      .emit(
        event,
        payload,
      );
  }

  /*
   * Send to Admin dashboard.
   */
  emitToAdmins(
    event: string,
    payload: unknown,
  ) {
    this.server
      .to(
        'admins',
      )
      .emit(
        event,
        payload,
      );
  }

  /*
   * Works for BOTH:
   *
   * Guest     → order room
   * User      → user room
   */
  emitOrderStatus(
    orderId: string,

    userId:
      | string
      | null
      | undefined,

    payload: unknown,
  ) {
    /*
     * Guest tracking room.
     */
    this.server
      .to(
        `order:${orderId}`,
      )
      .emit(
        'order.status',
        payload,
      );

    /*
     * Logged-in account.
     */
    if (userId) {
      this.emitToUser(
        userId,
        'order.status',
        payload,
      );
    }
  }

  emitHardwareStatus(
    payload: unknown,
  ) {
    this.emitToAdmins(
      'hardware.status',
      payload,
    );
  }
}