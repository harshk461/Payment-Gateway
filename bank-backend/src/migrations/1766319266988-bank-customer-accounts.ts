import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class BankCustomerAccounts1766319266988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_customer_accounts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'account_number',
            type: 'varchar',
            length: '36',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'cif_number',
            type: 'varchar',
            length: '36',
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
            name: 'branch_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'account_type',
            type: 'enum',
            enum: ['savings', 'current', 'premium_savings', 'fixed_deposit'],
            isNullable: false,
          },
          {
            name: 'account_status',
            type: 'enum',
            enum: ['active', 'frozen', 'closed', 'dormant'],
            default: "'active'",
          },
          {
            name: 'balance',
            type: 'int',
            default: 0,
          },
          {
            name: 'blocked_amount',
            type: 'int',
            default: 0,
          },
          {
            name: 'interest_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: "'0.00'",
          },
          {
            name: 'opened_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'maturity_date',
            type: 'date',
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

    // Foreign key constraints
    await queryRunner.createForeignKey(
      'bank_customer_accounts',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_customers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bank_customer_accounts',
      new TableForeignKey({
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_branches',
        onDelete: 'RESTRICT',
      }),
    );

    // Performance indexes
    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_customer_id',
        columnNames: ['customer_id'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_branch_id',
        columnNames: ['branch_id'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_status',
        columnNames: ['account_status'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_balance',
        columnNames: ['balance'],
      }),
    );

    // Composite indexes for branch reporting
    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_branch_status',
        columnNames: ['branch_id', 'account_status'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customer_accounts',
      new TableIndex({
        name: 'IDX_accounts_customer_status',
        columnNames: ['customer_id', 'account_status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.dropForeignKey(
      'bank_customer_accounts',
      'FK_accounts_customer_id_customers_id',
    );
    await queryRunner.dropForeignKey(
      'bank_customer_accounts',
      'FK_accounts_branch_id_branches_id',
    );

    // Drop indexes
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_branch_status',
    );
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_customer_status',
    );
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_balance',
    );
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_status',
    );
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_branch_id',
    );
    await queryRunner.dropIndex(
      'bank_customer_accounts',
      'IDX_accounts_customer_id',
    );

    // Drop table
    await queryRunner.dropTable('bank_customer_accounts');
  }
}
