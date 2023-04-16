import { RoleEntity } from 'src/modules/roles/domain/models/role.entity';
import { RoleRepository } from 'src/modules/roles/domain/repositories/rolo.repository';
import { AuditEntity } from 'src/modules/shared/domain/models/audit.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  code_menu: number | string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'varchar', length: 255 })
  icon: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToMany((type) => RoleEntity, (role) => role.menus)
  roles: RoleEntity[];
}
