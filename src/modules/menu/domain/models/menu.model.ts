import { AuditModel } from 'src/modules/shared/domain/models/audit.model';

export class MenuModel extends AuditModel {
  constructor(
    public id: number,
    public code_menu: number | string,
    public name: string,
    public path: string,
    public order: number,
    public icon: string,
    public type: string,
  ) {
    super();
  }
}
