import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../roles/domain/models/role.entity';
import { RoleInfrastructure } from '../roles/infrastructure/role.infrastructure';
import { UserApplication } from './application/user.application';
import { UserEntity } from './domain/models/user.entity';
import { UserInfrastructure } from './infrastructure/user.infrastructure';
import { AuthApplication } from '../auth/application/auth.application';
import { BaseRepository } from '../shared/domain/repositories/base-repository';
import { AuthInfrastructure } from '../auth/infrastructure/auth.Infrastructure';
import { JwtStrategy } from '../auth/domain/models/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtModule.register({
      secret: process.env.KEYWORD,
      signOptions: { expiresIn: process.env.TIMEOUT + 's' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserApplication,
    AuthApplication,
    JwtStrategy,
    {
      provide: 'UserRepository',
      useClass: UserInfrastructure,
    },
    {
      provide: 'RoleRepository',
      useClass: RoleInfrastructure,
    },
    {
      provide: BaseRepository,
      useClass: AuthInfrastructure,
    },
  ],
})
export class UsersModule {}
