import { DTOAbstract } from 'src/modules/shared/application/interfaces/dtos/abstract.dto';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { MenuModel } from '../../domain/models/menu.model';

export class MenuDto extends DTOAbstract<MenuModel> {
  callback(result: Result<MenuModel>): Result<MenuModel> {
    const data = result.payload.data;

    if (Array.isArray(data)) {
      result.payload.data = data.map((product: MenuModel) => {
        delete (result.payload.data as MenuModel).status;

        return product;
      });
    } else {
      const MovementModel = result.payload.data as MenuModel;

      delete (result.payload.data as MenuModel).status;
    }
    return result;
  }
}
