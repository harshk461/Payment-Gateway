import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AuthorizationRecord1766408336434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_authorizations',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'card_id',
            type: 'varchar',
          },
          {
            name: 'account_id',
            type: 'varchar',
          },
          {
            name: 'merchant_id',
            type: 'varchar',
          },
          {
            name: 'order_id',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['AUTHORIZED', 'CAPTURED', 'REVERSED', 'EXPIRED'],
            default: `'AUTHORIZED'`,
          },
          {
            name: 'captured_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_authorizations');
  }
}
