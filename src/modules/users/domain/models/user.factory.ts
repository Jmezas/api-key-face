import { PasswordService } from '../services/password.service';
import { TokensService } from '../services/tokens.service';
import { UserModel } from './user.model';

export interface IUser {
  id: number;
  name: string; 
  lastname: string;
  email: string;
  password: string;
  roles: number[];  
  refreshToken: string; 
  imageURL: string;
  imageName: string;
}

export class UserFactory {
  async create(user: Partial<IUser>) {
    const id = user.id || 0;
    const name = user.name;
    const lastname = user.lastname;
    const email = user.email;  
    const imageURL = user.imageURL;
    const imageName = user.imageName;
    const roles = user.roles; 
    const password = await PasswordService.hashPasswordArgon(user.password);
    const refreshToken = TokensService.generateRefreshToken();

    if (name.trim() === '' || name.trim().length < 4) {
      throw new Error('Invalid name');
    }

    return new UserModel(
      id,
      name,
      lastname,
      email,
      password,
      refreshToken,  
      imageURL,
      imageName,
      roles, 
    );
  }
}
