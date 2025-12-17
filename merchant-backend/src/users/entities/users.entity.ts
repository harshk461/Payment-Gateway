import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('app_users')
@Index('IDX_PHONE_NUMBER', ['phoneNumber'])
export class AppUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ name: 'phone_number', type: 'varchar', unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  gender?: string;

  @Column({ name: 'is_registered', type: 'boolean', default: false })
  isRegistered: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
