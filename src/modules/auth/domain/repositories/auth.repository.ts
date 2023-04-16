import Result from 'src/modules/shared/application/interfaces/result.interface';
import { AuthModel } from '../models/auth.model';
import { EmailModel } from '../models/email';
import { TokensModel } from '../models/tokens.model';

export interface AuthRepository {
  login(auth: AuthModel): Promise<Result<TokensModel>>;
  getNewAccessToken(refreshToken: string): Promise<Result<TokensModel>>;
  findbyEmail(email: string): Promise<Result<EmailModel>>;
}
