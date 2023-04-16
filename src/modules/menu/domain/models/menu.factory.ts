import { MenuModel } from './menu.model';

export interface IMenu {
  id: number;
  code_menu: number;
  name: string;
  path: string;
  icon: string;
  order: number;
  type: string;
}

export class MenuFactory {
  create(menu: Partial<IMenu>) {
    const id = menu.id;
    const code_menu = menu.code_menu;
    const name = menu.name;
    const path = menu.path;
    const icon = menu.icon;
    const order = menu.order;
    const type = menu.type;

    return new MenuModel(id, code_menu, name, path, order, icon, type);
  }
}
