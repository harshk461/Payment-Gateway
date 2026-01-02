import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Customers1766319235887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_customers',
        columns: [
          // ✅ Primary key (UUID)
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },

          // ✅ Business ID (CUST001 format)
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isUnique: true,
          },

          // ✅ Customer details
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
            isUnique: true,
          },

          // ✅ Banking KYC status (NOT account_type)
          {
            name: 'kyc_status',
            type: 'enum',
            enum: ['pending', 'verified', 'rejected'],
            default: "'pending'",
          },

          // ✅ Branch foreign key
          {
            name: 'branch_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },

          // ✅ Timestamps
          {
            name: 'joined_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // ✅ Foreign key to branches (must exist first)
    await queryRunner.createForeignKey(
      'bank_customers',
      new TableForeignKey({
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_branches',
        onDelete: 'RESTRICT',
      }),
    );

    // ✅ Indexes for performance (matches your entity)
    await queryRunner.createIndex(
      'bank_customers',
      new TableIndex({
        name: 'IDX_BANK_CUSTOMERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customers',
      new TableIndex({
        name: 'IDX_BANK_CUSTOMERS_PHONE',
        columnNames: ['phone'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customers',
      new TableIndex({
        name: 'IDX_BANK_CUSTOMERS_BRANCH',
        columnNames: ['branch_id'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customers',
      new TableIndex({
        name: 'IDX_BANK_CUSTOMERS_KYC_STATUS',
        columnNames: ['kyc_status'],
      }),
    );

    await queryRunner.createIndex(
      'bank_customers',
      new TableIndex({
        name: 'IDX_BANK_CUSTOMERS_CUSTOMER_ID',
        columnNames: ['customer_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    await queryRunner.dropForeignKey(
      'bank_customers',
      'FK_bank_customers_branch_id_branches_id',
    );

    // Drop table
    await queryRunner.dropTable('bank_customers');
  }
}
