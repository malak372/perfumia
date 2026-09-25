import {
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GuestClaimService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async claimByVerifiedEmail(
    userId: string,
    email: string,
  ) {
    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    /*
     * Only guest orders:
     *
     * userId = NULL
     *
     * and the checkout email belongs
     * to the now-verified account.
     */
    const guestOrders =
      await this.prisma.db.orm.public.Order
        .where({
          userId: null,
          contactEmail:
            normalizedEmail,
        })
        .all();

    let ordersLinked = 0;
    let paymentsLinked = 0;
    let preferencesLinked = 0;

    for (
      const order of guestOrders
    ) {
      /*
       * Use userId = null in the update filter
       * to make claiming idempotent and safer
       * against concurrent requests.
       */
      const claimedOrder =
        await this.prisma.db.orm.public.Order
          .where({
            id: order.id,
            userId: null,
          })
          .update({
            userId,
          });

      if (!claimedOrder) {
        continue;
      }

      ordersLinked++;

      /*
       * The recommendation preference
       * that generated this order also
       * becomes owned by the user.
       */
      const preference =
        await this.prisma.db.orm.public.GiftPreference
          .where({
            id:
              order.preferenceId,
            userId: null,
          })
          .update({
            userId,
          });

      if (preference) {
        preferencesLinked++;
      }

      /*
       * Claim every Payment belonging
       * to this guest order.
       *
       * This is what makes old guest
       * payments/receipts appear in the
       * account after registration.
       */
      const guestPayments =
        await this.prisma.db.orm.public.Payment
          .where({
            orderId:
              order.id,
            userId: null,
          })
          .all();

      for (
        const payment of guestPayments
      ) {
        const claimedPayment =
          await this.prisma.db.orm.public.Payment
            .where({
              id:
                payment.id,
              userId:
                null,
            })
            .update({
              userId,
            });

        if (claimedPayment) {
          paymentsLinked++;
        }
      }
    }

    return {
      ordersLinked,
      paymentsLinked,
      preferencesLinked,
    };
  }
}