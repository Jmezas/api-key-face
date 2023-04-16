import { DTOAbstract } from 'src/modules/shared/application/interfaces/dtos/abstract.dto';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { RoleModel } from '../../domain/models/role.model';

export class RoleDto extends DTOAbstract<RoleModel> {
  callback(result: Result<RoleModel>): Result<RoleModel> {
    const data = result.payload.data;
    if (Array.isArray(data)) {
      result.payload.data = data.map((role: RoleModel) => {
        if (role.menus) {
          role.menus = role.menus.map((menu: any) => menu.name);
        }
        return role;
      });
    } else {
      const userModel = result.payload.data as RoleModel;
      if (userModel.menus) {
        userModel.menus = userModel.menus.map((role: any) => role.id);
      }
      delete (result.payload.data as RoleModel).status;
    }
    return result;
  }
}
