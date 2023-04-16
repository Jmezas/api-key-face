import { Inject, Injectable } from '@nestjs/common';
import { MenuRepository } from 'src/modules/menu/domain/repositories/menu.repository';
import { BaseApplication } from 'src/modules/shared/application/interfaces/base-application';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { RoleModel } from '../domain/models/role.model';
import { RoleRepository } from '../domain/repositories/rolo.repository';
import { RoleDto } from './dto/dto';

@Injectable()
export class RoleApplication extends BaseApplication<RoleModel> {
  constructor(
    @Inject('RoleRepository')
    private RoleRepository: RoleRepository,
    @Inject('MenuRepository')
    private MenuRepository: MenuRepository,
  ) {
    super(RoleRepository, new RoleDto());
  }
  override async add(entity: RoleModel): Promise<Result<RoleModel>> {
    if (entity.menus.length > 0) {
      const menus = await this.MenuRepository.findByIds(
        entity.menus as number[],
      );
      entity.menus = menus;
    } else {
      delete entity.menus;
    }
    const result = await this.RoleRepository.insert(entity);
    return new RoleDto().mapping(result);
  }
  override async update(
    entity: RoleModel,
    where: object,
    relations: string[],
  ): Promise<Result<RoleModel>> {
    if (entity.menus.length > 0) {
      const menus = await this.MenuRepository.findByIds(
        entity.menus as number[],
      );
      entity.menus = menus;
    } else {
      delete entity.menus;
    }
    const result = await this.RoleRepository.update(entity, where, relations);
    return new RoleDto().mapping(result);
  }
}
