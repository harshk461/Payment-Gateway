import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CustomersAddresses1766319251973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_customer_addresses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'address_line_1',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'address_line_2',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'pin_code',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            default: `'IN'`,
          },
          {
            name: 'is_active',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: `'ACTIVE'`,
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

    // FK → customer
    await queryRunner.createForeignKey(
      'bank_customer_addresses',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedTableName: 'bank_customers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Index for fast lookup
    await queryRunner.createIndex(
      'bank_customer_addresses',
      new TableIndex({
        name: 'IDX_ADDRESS_CUSTOMER',
        columnNames: ['customer_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_customer_addresses');
  }
}
