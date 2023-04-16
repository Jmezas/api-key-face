import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../roles/domain/models/role.entity';
import { RoleInfrastructure } from '../roles/infrastructure/role.infrastructure';
import { UserApplication } from './application/user.application';
import { UserEntity } from './domain/models/user.entity';
import { UserInfrastructure } from './infrastructure/user.infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService,
    UserApplication,
    {
      provide: 'UserRepository',
      useClass: UserInfrastructure,
    },
    {
      provide: 'RoleRepository',
      useClass: RoleInfrastructure,
    },
  ]
})
export class UsersModule {}
