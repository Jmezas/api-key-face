import { MenuEntity } from 'src/modules/menu/domain/models/menu.entity';
import { AuditModel } from 'src/modules/shared/domain/models/audit.model';

export class RoleModel extends AuditModel {
  constructor(
    public id: number,
    public name: string,
    public menus: MenuEntity[] | number[] | string[],
  ) {
    super();
  }
}
