import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

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

          // -------- RELATION --------
          {
            name: 'intent_id',
            type: 'int',
            isNullable: false,
          },

          // -------- AMOUNT --------
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            isNullable: false,
          },

          // -------- PROCESSING --------
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'attempt_no',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'connector',
            type: 'varchar',
            isNullable: false,
          },

          // -------- PAYMENT METHOD --------
          {
            name: 'payment_method',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'card_network',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'upi_app',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'wallet_provider',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bank_code',
            type: 'varchar',
            isNullable: true,
          },

          // -------- RESULT --------
          {
            name: 'provider_reference',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'failure_reason',
            type: 'varchar',
            isNullable: true,
          },

          // -------- RAW RESPONSE --------
          {
            name: 'response_payload',
            type: 'json',
            isNullable: true,
          },

          // -------- TIMESTAMPS --------
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

    await queryRunner.createIndex(
      'app_payment_transactions',
      new TableIndex({
        name: 'IDX_TXN_INTENT_ID',
        columnNames: ['intent_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_payment_transactions');
  }
}
