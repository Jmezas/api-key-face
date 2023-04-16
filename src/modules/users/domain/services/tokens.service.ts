import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/user.model';
import { ITokens } from '../models/tokens.interface';

export class TokensService {
  static generateRefreshToken(): string {
    return uuidv4();
  }

  static generateTokens(user: Partial<UserModel>): ITokens {
    const refreshToken = TokensService.generateRefreshToken();
    const accessToken = 's';

    return {
      accessToken,
      refreshToken,
    };
  }
}
