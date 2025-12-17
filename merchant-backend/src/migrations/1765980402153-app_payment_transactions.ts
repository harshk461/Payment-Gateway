import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AppPaymentTransactions1765980402153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_payment_transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'intent_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'client_secret',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'idempotency_key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'event',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'provider_reference',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            isNullable: false,
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_payment_transactions');
  }
}
