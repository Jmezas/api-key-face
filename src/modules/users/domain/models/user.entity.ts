import { IsEmail, IsNotEmpty } from 'class-validator';
import { RoleEntity } from 'src/modules/roles/domain/models/role.entity';
import { AuditEntity } from 'src/modules/shared/domain/models/audit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  lastname: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  refreshToken: string;

  @Column({ type: 'varchar', length: 500 })
  imageURL: string;

  @Column({ type: 'varchar', length: 500 })
  imageName: string;

  @ManyToMany((type) => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}
