import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../roles/domain/models/role.entity';
import { UserEntity } from '../users/domain/models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { BaseRepository } from '../shared/domain/repositories/base-repository';
import { AuthApplication } from './application/auth.application';
import { sendEMail } from './domain/models/formatHTML';
import { JwtStrategy } from './domain/models/jwt.strategy';
import { AuthInfrastructure } from './infrastructure/auth.Infrastructure';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtModule.register({
      secret: process.env.KEYWORD,
      signOptions: { expiresIn: process.env.TIMEOUT + 's' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    AuthApplication,
    JwtStrategy,
    sendEMail,
    {
      provide: BaseRepository,
      useClass: AuthInfrastructure,
    },
  ]
})
export class AuthModule {}
