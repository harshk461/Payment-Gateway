import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Transactions1766319276202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_transactions',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          {
            name: 'txn_reference',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          { name: 'card_id', type: 'varchar', length: '36', isNullable: true },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'credit',
              'debit',
              'fee',
              'interest',
              'adjustment',
              'refund',
            ],
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'balance_before',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'balance_after',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'category', type: 'varchar', length: '50', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'completed', 'failed', 'reversed', 'hold'],
            default: "'pending'",
          },
          {
            name: 'payment_method',
            type: 'enum',
            enum: [
              'UPI',
              'NEFT',
              'RTGS',
              'IMPS',
              'CARD',
              'CASH',
              'CHEQUE',
              'INTERNAL',
            ],
            isNullable: true,
          },
          {
            name: 'source_reference',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'source_bank',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'source_ifsc',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'destination_account',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'destination_ifsc',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'transaction_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.00',
          },
          {
            name: 'gst_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.00',
          },
          { name: 'initiated_at', type: 'timestamp', isNullable: true },
          {
            name: 'processed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'completed_at', type: 'timestamp', isNullable: true },
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

    // Foreign Keys
    await queryRunner.createForeignKey(
      'bank_transactions',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_customer_accounts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bank_transactions',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_customers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bank_transactions',
      new TableForeignKey({
        columnNames: ['card_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_cards',
        onDelete: 'SET NULL',
      }),
    );

    // Indexes
    await queryRunner.createIndices('bank_transactions', [
      new TableIndex({
        name: 'IDX_transactions_account_id',
        columnNames: ['account_id'],
      }),
      new TableIndex({
        name: 'IDX_transactions_customer_id',
        columnNames: ['customer_id'],
      }),
      new TableIndex({
        name: 'IDX_transactions_card_id',
        columnNames: ['card_id'],
      }),
      new TableIndex({
        name: 'IDX_transactions_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'IDX_transactions_date',
        columnNames: ['processed_at'],
      }),
      new TableIndex({
        name: 'IDX_transactions_customer_date',
        columnNames: ['customer_id', 'processed_at'],
      }),
      new TableIndex({
        name: 'IDX_transactions_type_status',
        columnNames: ['type', 'status'],
      }),
      new TableIndex({
        name: 'IDX_transactions_reference',
        columnNames: ['txn_reference'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'bank_transactions',
      'FK_transactions_account_id_accounts_id',
    );
    await queryRunner.dropForeignKey(
      'bank_transactions',
      'FK_transactions_customer_id_bank_customers_id',
    );
    await queryRunner.dropForeignKey(
      'bank_transactions',
      'FK_transactions_card_id_cards_id',
    );
    await queryRunner.dropTable('bank_transactions');
  }
}
