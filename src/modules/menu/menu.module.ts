import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './domain/models/menu.entity';
import { BaseRepository } from '../shared/domain/repositories/base-repository';
import { MenuInfrastructure } from './infrastructure/menu.infrastructure';
import { MenuApplication } from './application/menu.application';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  controllers: [MenuController],
  providers: [MenuService,MenuApplication, {
    provide: BaseRepository,
    useClass: MenuInfrastructure,
  },]
})
export class MenuModule {}
