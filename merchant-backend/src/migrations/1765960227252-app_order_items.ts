import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AppOrderItems1765960227252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_order_items',
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
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'per_price',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
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

    await queryRunner.createForeignKeys('app_order_items', [
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'app_orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'app_products',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_order_items');
  }
}
