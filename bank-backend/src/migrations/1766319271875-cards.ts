import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Cards1766319271875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_cards',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          {
            name: 'card_number',
            type: 'varchar',
            length: '19',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'card_type',
            type: 'enum',
            enum: ['debit', 'credit', 'prepaid'],
            isNullable: false,
          },
          {
            name: 'network',
            type: 'enum',
            enum: ['VISA', 'MasterCard', 'RUPAY', 'AMEX'],
            isNullable: false,
          },
          {
            name: 'cardholder_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          { name: 'expiry_month', type: 'tinyint', isNullable: false },
          { name: 'expiry_year', type: 'smallint', isNullable: false },
          { name: 'cvv', type: 'varchar', length: '3', isNullable: true },
          {
            name: 'credit_limit',
            type: 'int',
            default: 0,
          },
          {
            name: 'current_balance',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'blocked', 'expired', 'cancelled', 'hotlisted'],
            default: "'active'",
          },
          {
            name: 'daily_limit',
            type: 'int',
            default: 0,
          },
          {
            name: 'international_enabled',
            type: 'tinyint',
            default: '1',
          },
          { name: 'contactless_enabled', type: 'tinyint', default: '1' },
          { name: 'otp_enabled', type: 'tinyint', default: '1' },
          { name: 'issued_date', type: 'date', isNullable: true },
          { name: 'activated_date', type: 'timestamp', isNullable: true },
          { name: 'last_transaction_at', type: 'timestamp', isNullable: true },
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
      'bank_cards',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_customers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bank_cards',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_customer_accounts',
        onDelete: 'CASCADE',
      }),
    );

    // Indexes
    await queryRunner.createIndices('bank_cards', [
      new TableIndex({
        name: 'IDX_cards_customer_id',
        columnNames: ['customer_id'],
      }),
      new TableIndex({
        name: 'IDX_cards_account_id',
        columnNames: ['account_id'],
      }),
      new TableIndex({ name: 'IDX_cards_status', columnNames: ['status'] }),
      new TableIndex({
        name: 'IDX_cards_expiry',
        columnNames: ['expiry_month', 'expiry_year'],
      }),
      new TableIndex({
        name: 'IDX_cards_customer_status',
        columnNames: ['customer_id', 'status'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'bank_cards',
      'FK_cards_customer_id_bank_customers_id',
    );
    await queryRunner.dropForeignKey(
      'bank_cards',
      'FK_cards_account_id_accounts_id',
    );
    await queryRunner.dropTable('bank_cards');
  }
}
