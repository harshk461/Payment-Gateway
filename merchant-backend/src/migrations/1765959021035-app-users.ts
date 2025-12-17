import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AppUsers1765959021035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'is_registered',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    await queryRunner.createIndex(
      'app_users',
      new TableIndex({
        name: 'IDX_PHONE_NUMBER',
        columnNames: ['phone_number'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_users');
  }
}
