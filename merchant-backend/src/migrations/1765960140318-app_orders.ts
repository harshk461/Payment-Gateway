import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AppOrders1765960140318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_orders',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'cart_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'total',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'PENDING'`,
          },
          {
            name: 'ip_info',
            type: 'json',
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

    await queryRunner.createForeignKey(
      'app_orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'app_users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_orders');
  }
}
