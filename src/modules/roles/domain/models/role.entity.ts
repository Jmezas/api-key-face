import { MenuEntity } from 'src/modules/menu/domain/models/menu.entity';
import { AuditEntity } from 'src/modules/shared/domain/models/audit.entity';
import { UserEntity } from 'src/modules/users/domain/models/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany((type) => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToMany((type) => MenuEntity, (menu) => menu.roles)
  @JoinTable()
  menus: MenuEntity[] | number[] | string[];
}
