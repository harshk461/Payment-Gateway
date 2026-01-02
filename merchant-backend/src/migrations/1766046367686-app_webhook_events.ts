import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AppWebhookEvents1766046367686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_webhook_events',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'merchant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'event',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payload',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'endpoint',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'attempts',
            type: 'int',
            default: 0,
          },
          {
            name: 'last_error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'app_webhook_events',
      new TableIndex({
        name: 'IDX_WEBHOOK_MERCHANT_EVENT',
        columnNames: ['merchant_id', 'event'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_webhook_events');
  }
}
