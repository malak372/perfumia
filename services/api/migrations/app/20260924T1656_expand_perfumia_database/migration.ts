#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6a5cadd3418c17fed847e7fce2f2449e28d85d669dca299d6f29a6f52f293043/contract';
import startContract from '../../snapshots/6a5cadd3418c17fed847e7fce2f2449e28d85d669dca299d6f29a6f52f293043/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/818f3e52d06f96f678ec575a53c3b8849959b3ece6cf93165487b12f71cd7142/contract';
import endContract from '../../snapshots/818f3e52d06f96f678ec575a53c3b8849959b3ece6cf93165487b12f71cd7142/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'giftPreference',
        constraint: 'giftPreference_gender_check_9e8dd636',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'giftPreference',
        constraint: 'giftPreference_interests_elem_not_null_4b23e016',
      }),
      this.dropColumn({ schema: 'public', table: 'giftPreference', column: 'gender' }),
      this.dropColumn({ schema: 'public', table: 'giftPreference', column: 'interests' }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'order',
        constraint: 'order_status_check_8be91940',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'perfume',
        constraint: 'perfume_targetGender_check_852aef0b',
      }),
      this.dropColumn({ schema: 'public', table: 'perfume', column: 'targetGender' }),
      this.createTable({
        schema: 'public',
        table: 'aiModel',
        columns: [
          col('configuration', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('enabled', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('modelIdentifier', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('priority', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('purpose', 'text', {
            notNull: true,
            default: lit('PERFUME_RECOMMENDATION'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'aiModel_provider_check_3e7d71a2',
            "\"provider\" IN ('OPENAI', 'GOOGLE', 'ANTHROPIC', 'OTHER')",
          ),
          checkExpression(
            'aiModel_purpose_check_0b3d5ef7',
            "\"purpose\" IN ('PERFUME_RECOMMENDATION', 'TEXT_GENERATION', 'OTHER')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'contactMessage',
        columns: [
          col('adminReply', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('repliedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('NEW'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'contactMessage_status_check_94699d1b',
            "\"status\" IN ('NEW', 'READ', 'REPLIED', 'CLOSED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'notification',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('read', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('readAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'notification_type_check_80a5ec20',
            "\"type\" IN ('ORDER', 'PAYMENT', 'SUPPORT', 'SYSTEM', 'PROMOTION')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'payment',
        columns: [
          col('amount', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('USD'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('failureCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('failureMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('orderId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('paidAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('provider', 'text', {
            notNull: true,
            default: lit('STRIPE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('refundedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('stripeCheckoutSessionId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('stripePaymentIntentId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('payment_provider_check_3510eb02', '"provider" IN (\'STRIPE\')'),
          checkExpression(
            'payment_status_check_e8b7dfa8',
            "\"status\" IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'paymentEvent',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('eventType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('payload', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('paymentId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('processed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('processedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('providerEventId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'supportTicket',
        columns: [
          col('adminReply', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('paymentId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('resolvedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ticketNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'supportTicket_category_check_96b6ed6b',
            "\"category\" IN ('PAYMENT', 'ORDER', 'ACCOUNT', 'HARDWARE', 'DELIVERY', 'OTHER')",
          ),
          checkExpression(
            'supportTicket_status_check_8580ec13',
            "\"status\" IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'systemSetting',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('value', 'jsonb', { notNull: true, codecRef: { codecId: 'pg/jsonb@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'userSettings',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('emailNotifications', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('language', 'text', {
            notNull: true,
            default: lit('en'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('marketingNotifications', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('orderUpdates', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('paymentUpdates', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('pushNotifications', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('supportUpdates', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'giftPreference',
        column: col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'giftPreference',
        column: col('fragranceStyle', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'giftPreference',
        column: col('intensity', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'giftPreference',
        column: col('longevity', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'perfume',
        column: col('intensity', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'perfume',
        column: col('longevity', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'recommendationRun',
        column: col('aiModelId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('deletedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'giftPreference',
        column: col('preferredNotes', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
      }),
      this.setNotNull({ schema: 'public', table: 'giftPreference', column: 'preferredNotes' }),
      this.setNotNull({ schema: 'public', table: 'giftPreference', column: 'recipientName' }),
      this.dropNotNull({ schema: 'public', table: 'giftPreference', column: 'age' }),
      this.addUnique({
        schema: 'public',
        table: 'aiModel',
        constraint: 'aiModel_provider_modelIdentifier_purpose_key',
        columns: ['provider', 'modelIdentifier', 'purpose'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'giftPreference',
        constraint: 'giftPreference_intensity_check_0fe95d92',
        expression: "\"intensity\" IN ('LIGHT', 'MEDIUM', 'STRONG')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'giftPreference',
        constraint: 'giftPreference_longevity_check_d7b30714',
        expression: "\"longevity\" IN ('SHORT', 'MODERATE', 'LONG')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'giftPreference',
        constraint: 'giftPreference_preferredNotes_elem_not_null_0c007a99',
        expression: 'array_position("preferredNotes", NULL) IS NULL',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'order',
        constraint: 'order_status_check_64e22534',
        expression:
          "\"status\" IN ('CREATED', 'PENDING_PAYMENT', 'PAID', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')",
      }),
      this.addUnique({
        schema: 'public',
        table: 'payment',
        constraint: 'payment_stripePaymentIntentId_key',
        columns: ['stripePaymentIntentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'payment',
        constraint: 'payment_stripeCheckoutSessionId_key',
        columns: ['stripeCheckoutSessionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'paymentEvent',
        constraint: 'paymentEvent_providerEventId_key',
        columns: ['providerEventId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'perfume',
        constraint: 'perfume_intensity_check_0fe95d92',
        expression: "\"intensity\" IN ('LIGHT', 'MEDIUM', 'STRONG')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'perfume',
        constraint: 'perfume_longevity_check_d7b30714',
        expression: "\"longevity\" IN ('SHORT', 'MODERATE', 'LONG')",
      }),
      this.addUnique({
        schema: 'public',
        table: 'supportTicket',
        constraint: 'supportTicket_ticketNumber_key',
        columns: ['ticketNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'systemSetting',
        constraint: 'systemSetting_key_key',
        columns: ['key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userSettings',
        constraint: 'userSettings_userId_key',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'contactMessage',
        index: 'contactMessage_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notification',
        index: 'notification_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notification',
        index: 'notification_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'payment',
        index: 'payment_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'payment',
        index: 'payment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'paymentEvent',
        index: 'paymentEvent_paymentId_idx_b2fe9a10',
        columns: ['paymentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'recommendationRun',
        index: 'recommendationRun_aiModelId_idx_10903664',
        columns: ['aiModelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'supportTicket',
        index: 'supportTicket_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'supportTicket',
        index: 'supportTicket_paymentId_idx_b2fe9a10',
        columns: ['paymentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'supportTicket',
        index: 'supportTicket_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'contactMessage',
        foreignKey: {
          name: 'contactMessage_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notification',
        foreignKey: {
          name: 'notification_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notification',
        foreignKey: {
          name: 'notification_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'payment',
        foreignKey: {
          name: 'payment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'payment',
        foreignKey: {
          name: 'payment_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'paymentEvent',
        foreignKey: {
          name: 'paymentEvent_paymentId_fkey',
          columns: ['paymentId'],
          references: { schema: 'public', table: 'payment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recommendationRun',
        foreignKey: {
          name: 'recommendationRun_aiModelId_fkey',
          columns: ['aiModelId'],
          references: { schema: 'public', table: 'aiModel', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'supportTicket',
        foreignKey: {
          name: 'supportTicket_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'supportTicket',
        foreignKey: {
          name: 'supportTicket_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'supportTicket',
        foreignKey: {
          name: 'supportTicket_paymentId_fkey',
          columns: ['paymentId'],
          references: { schema: 'public', table: 'payment', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userSettings',
        foreignKey: {
          name: 'userSettings_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
