import { RoleEntity } from 'src/modules/roles/domain/models/role.entity';
import { AuditModel } from 'src/modules/shared/domain/models/audit.model'; 

export class UserModel extends AuditModel {
  constructor(
    public id: number,
    public name: string,
    public lastname: string,
    public email: string,
    public password: string,
    public refreshToken: string,  
    public imageURL: string,
    public imageName: string,
    public roles: number[] | string[] | RoleEntity[], 
  ) {
    super();
  }
}
