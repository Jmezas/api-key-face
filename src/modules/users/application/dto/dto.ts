import { DTOAbstract } from 'src/modules/shared/application/interfaces/dtos/abstract.dto';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { UserModel } from '../../domain/models/user.model';
import { PasswordService } from '../../domain/services/password.service';

export class UserDTO extends DTOAbstract<UserModel> {
  callback(result: Result<UserModel>): Result<UserModel> {
    const data = result.payload.data;

    if (Array.isArray(data)) {
      result.payload.data = data.map((user: UserModel) => {
        if (user.roles) {
          user.roles = user.roles.map((role: any) => role.name);
        } 
        delete user.status;
        delete user.refreshToken;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.deletedAt;
        delete user.password;
        delete user.createdUser;
        delete user.updatedUser;
        delete user.deletedUser;
        return user;
      });
    } else {
      const user = result.payload.data as UserModel;
      // if (userModel.roles) {
      //   userModel.roles = userModel.roles.map((role: any) => role.id);
      // }

      /* solucionar */
      // userModel.password = PasswordService.hashPasswordArgon(
      //   (result.payload.data as UserModel).password,
      // );

      delete user.status;
      delete user.refreshToken;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.deletedAt;
      delete user.password;
      delete user.createdUser;
      delete user.updatedUser;
      delete user.deletedUser;
    }

    return result;
  }
}
