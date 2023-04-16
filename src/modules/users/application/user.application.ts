import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { UserModel } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserDTO } from './dto/dto';
import { BaseApplication } from 'src/modules/shared/application/interfaces/base-application';
import { RoleRepository } from 'src/modules/roles/domain/repositories/rolo.repository';
import { UserPasswordModel } from '../domain/models/user.password';

@Injectable()
export class UserApplication extends BaseApplication<UserModel> {
  constructor(
    @Inject('UserRepository')
    private UserRepository: UserRepository,

    @Inject('RoleRepository')
    private RoleRepository: RoleRepository,
  ) {
    super(UserRepository, new UserDTO());
  }
  override async add(entity: UserModel): Promise<Result<UserModel>> {
    const user = await this.UserRepository.findByOne(
      { email: entity.email },
      [],
    );
    if (user.payload.data) {
      throw new ForbiddenException('El email ya existe');
    }
    if (entity.roles.length > 0) {
      const roles = await this.RoleRepository.findByIds(
        entity.roles as number[],
      );
      entity.roles = roles;
    } else {
      delete entity.roles;
    }
    const result = await this.UserRepository.insert(entity);
    return new UserDTO().mapping(result);
  }
  async update(
    entity: UserModel,
    where: object,
    relations: string[],
  ): Promise<Result<UserModel>> {
    if (entity.roles.length > 0) {
      const roles = await this.RoleRepository.findByIds(
        entity.roles as number[],
      );
      entity.roles = roles;
    } else {
      delete entity.roles;
    }
    const result = await this.UserRepository.update(entity, where, relations);
    return new UserDTO().mapping(result);
  }

  override async getPage(
    page: number,
    pagesize: number,
    where: { [s: string]: string | number | boolean },
    relations: string[],
    order: { [s: string]: string },
  ): Promise<Result<UserModel>> {
    const result = await this.UserRepository.getPage(
      page,
      pagesize,
      where,
      relations,
      order,
    );

    return new UserDTO().mapping(result);
  }

  async updatePassword(
    userPass: UserPasswordModel,
  ): Promise<Result<UserModel>> {
    const result = await this.UserRepository.updatePassword(userPass);
    return new UserDTO().mapping(result);
  }
}
