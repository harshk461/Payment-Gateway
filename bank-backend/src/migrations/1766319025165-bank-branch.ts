import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class BankBranch1766319025165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_branches',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'branch_code',
            type: 'varchar',
            length: '36',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'branch_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'pincode',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'ifsc_code',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'manager_id',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'contact_phone',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
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

    // Indexes
    await queryRunner.createIndex(
      'bank_branches',
      new TableIndex({
        name: 'IDX_branches_ifsc_code',
        columnNames: ['ifsc_code'],
      }),
    );

    await queryRunner.createIndex(
      'bank_branches',
      new TableIndex({
        name: 'IDX_branches_branch_code',
        columnNames: ['branch_code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_branches');
  }
}
