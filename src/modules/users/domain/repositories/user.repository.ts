import Result from 'src/modules/shared/application/interfaces/result.interface';
import { BaseRepository } from 'src/modules/shared/domain/repositories/base-repository';
import { UserModel } from '../models/user.model';
import { UserPasswordModel } from '../models/user.password';

export interface UserRepository extends BaseRepository<UserModel, string> {
  updatePassword(
    password: UserPasswordModel,
  ): Promise<Result<UserPasswordModel>>;
}
