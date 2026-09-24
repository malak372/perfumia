#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6a5cadd3418c17fed847e7fce2f2449e28d85d669dca299d6f29a6f52f293043/contract';
import endContract from '../../snapshots/6a5cadd3418c17fed847e7fce2f2449e28d85d669dca299d6f29a6f52f293043/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'bin',
        columns: [
          col('capacity', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('column', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('markerType', 'text', {
            notNull: true,
            default: lit('ARUCO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('markerValue', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('perfumeId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('quantity', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('reservedQuantity', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('row', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('bin_markerType_check_3214f779', "\"markerType\" IN ('ARUCO', 'QR')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'giftMessage',
        columns: [
          col('audioUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('messageText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('qrToken', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('qrUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', {
            notNull: true,
            default: lit('NONE'),
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
            'giftMessage_type_check_a70e8776',
            "\"type\" IN ('NONE', 'TEXT', 'VOICE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'giftPreference',
        columns: [
          col('age', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('budget', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fragrancePreferences', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('gender', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('interests', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('recipientName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'giftPreference_fragrancePreferences_elem_not_null_f9a4cd9d',
            'array_position("fragrancePreferences", NULL) IS NULL',
          ),
          checkExpression(
            'giftPreference_gender_check_9e8dd636',
            "\"gender\" IN ('MALE', 'FEMALE')",
          ),
          checkExpression(
            'giftPreference_interests_elem_not_null_4b23e016',
            'array_position("interests", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'hardwareJob',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('errorCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('errorMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('orderId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('retryCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('startedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('WAITING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('targetBinId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'hardwareJob_status_check_ddff71e0',
            "\"status\" IN ('WAITING', 'VERIFYING', 'PICKING', 'PLACING', 'CLOSING', 'PRINTING', 'WAXING', 'DONE', 'ERROR', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'hardwareJobEvent',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('details', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('jobId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('message', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'hardwareJobEvent_status_check_ddff71e0',
            "\"status\" IN ('WAITING', 'VERIFYING', 'PICKING', 'PLACING', 'CLOSING', 'PRINTING', 'WAXING', 'DONE', 'ERROR', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'inventoryMovement',
        columns: [
          col('binId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('perfumeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reservedDelta', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('stockDelta', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'inventoryMovement_type_check_f0ee7863',
            "\"type\" IN ('RESTOCK', 'RESERVE', 'RELEASE', 'PICK', 'ADJUSTMENT')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'order',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('orderNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('preferenceId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('selectedPerfumeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('CREATED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('unitPrice', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'order_status_check_8be91940',
            "\"status\" IN ('CREATED', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'perfume',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('brand', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fragranceFamily', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text[]', { notNull: true, codecRef: { codecId: 'pg/text@1', many: true } }),
          col('price', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tags', 'text[]', { notNull: true, codecRef: { codecId: 'pg/text@1', many: true } }),
          col('targetGender', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'perfume_notes_elem_not_null_f914e30f',
            'array_position("notes", NULL) IS NULL',
          ),
          checkExpression(
            'perfume_tags_elem_not_null_aecbe9e2',
            'array_position("tags", NULL) IS NULL',
          ),
          checkExpression(
            'perfume_targetGender_check_852aef0b',
            "\"targetGender\" IN ('MEN', 'WOMEN', 'UNISEX')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'recommendationItem',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('perfumeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('rank', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('runId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('score', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'recommendationRun',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('engine', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('engineVersion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('inputSnapshot', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('preferenceId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_1954e8c0', "\"role\" IN ('USER', 'ADMIN')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'bin',
        constraint: 'bin_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'bin',
        constraint: 'bin_markerValue_key',
        columns: ['markerValue'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'bin',
        constraint: 'bin_row_column_key',
        columns: ['row', 'column'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'giftMessage',
        constraint: 'giftMessage_orderId_key',
        columns: ['orderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'giftMessage',
        constraint: 'giftMessage_qrToken_key',
        columns: ['qrToken'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'hardwareJob',
        constraint: 'hardwareJob_orderId_key',
        columns: ['orderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'order',
        constraint: 'order_orderNumber_key',
        columns: ['orderNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'order',
        constraint: 'order_preferenceId_key',
        columns: ['preferenceId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'perfume',
        constraint: 'perfume_sku_key',
        columns: ['sku'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'recommendationItem',
        constraint: 'recommendationItem_runId_rank_key',
        columns: ['runId', 'rank'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'recommendationItem',
        constraint: 'recommendationItem_runId_perfumeId_key',
        columns: ['runId', 'perfumeId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bin',
        index: 'bin_perfumeId_idx_8993de54',
        columns: ['perfumeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'giftPreference',
        index: 'giftPreference_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'hardwareJob',
        index: 'hardwareJob_targetBinId_idx_da923bc3',
        columns: ['targetBinId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'hardwareJobEvent',
        index: 'hardwareJobEvent_jobId_idx_623c8f77',
        columns: ['jobId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inventoryMovement',
        index: 'inventoryMovement_binId_idx_d5767bfc',
        columns: ['binId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inventoryMovement',
        index: 'inventoryMovement_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inventoryMovement',
        index: 'inventoryMovement_perfumeId_idx_8993de54',
        columns: ['perfumeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'order',
        index: 'order_selectedPerfumeId_idx_aa807870',
        columns: ['selectedPerfumeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'order',
        index: 'order_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'recommendationItem',
        index: 'recommendationItem_perfumeId_idx_8993de54',
        columns: ['perfumeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'recommendationItem',
        index: 'recommendationItem_runId_idx_a6016437',
        columns: ['runId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'recommendationRun',
        index: 'recommendationRun_preferenceId_idx_0332be8c',
        columns: ['preferenceId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bin',
        foreignKey: {
          name: 'bin_perfumeId_fkey',
          columns: ['perfumeId'],
          references: { schema: 'public', table: 'perfume', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'giftMessage',
        foreignKey: {
          name: 'giftMessage_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'giftPreference',
        foreignKey: {
          name: 'giftPreference_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'hardwareJob',
        foreignKey: {
          name: 'hardwareJob_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'hardwareJob',
        foreignKey: {
          name: 'hardwareJob_targetBinId_fkey',
          columns: ['targetBinId'],
          references: { schema: 'public', table: 'bin', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'hardwareJobEvent',
        foreignKey: {
          name: 'hardwareJobEvent_jobId_fkey',
          columns: ['jobId'],
          references: { schema: 'public', table: 'hardwareJob', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inventoryMovement',
        foreignKey: {
          name: 'inventoryMovement_binId_fkey',
          columns: ['binId'],
          references: { schema: 'public', table: 'bin', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inventoryMovement',
        foreignKey: {
          name: 'inventoryMovement_perfumeId_fkey',
          columns: ['perfumeId'],
          references: { schema: 'public', table: 'perfume', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inventoryMovement',
        foreignKey: {
          name: 'inventoryMovement_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'order', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'order',
        foreignKey: {
          name: 'order_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'order',
        foreignKey: {
          name: 'order_preferenceId_fkey',
          columns: ['preferenceId'],
          references: { schema: 'public', table: 'giftPreference', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'order',
        foreignKey: {
          name: 'order_selectedPerfumeId_fkey',
          columns: ['selectedPerfumeId'],
          references: { schema: 'public', table: 'perfume', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recommendationItem',
        foreignKey: {
          name: 'recommendationItem_runId_fkey',
          columns: ['runId'],
          references: { schema: 'public', table: 'recommendationRun', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recommendationItem',
        foreignKey: {
          name: 'recommendationItem_perfumeId_fkey',
          columns: ['perfumeId'],
          references: { schema: 'public', table: 'perfume', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recommendationRun',
        foreignKey: {
          name: 'recommendationRun_preferenceId_fkey',
          columns: ['preferenceId'],
          references: { schema: 'public', table: 'giftPreference', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
