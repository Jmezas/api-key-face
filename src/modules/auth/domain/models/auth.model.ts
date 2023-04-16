export class AuthModel {
  constructor(public email: string, public password: string) {}
}

export class MenuModel {
  id?: number;
  code_menu?: number;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  children?: MenuModel[];
}
