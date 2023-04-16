import Result from 'src/modules/shared/application/interfaces/result.interface';
import { BaseRepository } from 'src/modules/shared/domain/repositories/base-repository';
import { MenuEntity } from '../models/menu.entity';
import { MenuModel } from '../models/menu.model';

export interface MenuRepository extends BaseRepository<MenuModel, string> {
  findByIds(ids: number[]): Promise<MenuEntity[]>;
  findTree(where: object): Promise<Result<MenuEntity>>;
  findMenuRole(where: object): Promise<Result<MenuEntity>>;
}
