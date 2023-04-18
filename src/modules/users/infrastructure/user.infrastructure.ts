import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain/models/user.entity';
import { UserModel } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { BaseInfrastructure } from 'src/modules/shared/infrastructure/base-infrastructure';
import { UserPasswordModel } from '../domain/models/user.password';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { PasswordService } from '../domain/services/password.service';
import { UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/modules/shared/application/interfaces/dtos/response.dto';
import { Trace } from 'src/helpers/trace.helper';

export class UserInfrastructure
  extends BaseInfrastructure<UserModel>
  implements UserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {
    super(UserRepository);
  }
  async updatePassword(
    Upassword: UserPasswordModel,
  ): Promise<Result<UserPasswordModel>> {
    const user = await this.UserRepository.findOne({
      where: { email: Upassword.email },
    });
    if (user) {
      const isPasswordValid = await PasswordService.compareArgon(
        Upassword.password,
        user.password,
      );
      if (isPasswordValid) {
        user.password = await PasswordService.hashPasswordArgon(
          Upassword.passwordUpdate,
        );
        await this.UserRepository.save(user);
        return ResponseDto(Trace.TraceId(), {
          email: user.email,
          password: Upassword.passwordUpdate,
        });
      } else {
        throw new UnauthorizedException('Invalid  password');
      }
    } else {
      throw new UnauthorizedException('Invalid  password');
    }
  }
}
