import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trace } from 'src/helpers/trace.helper';
import { ResponseDto } from 'src/modules/shared/application/interfaces/dtos/response.dto';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { BaseInfrastructure } from 'src/modules/shared/infrastructure/base-infrastructure';
import { In, Repository } from 'typeorm';
import { RoleEntity } from '../domain/models/role.entity';
import { RoleModel } from '../domain/models/role.model';
import { RoleRepository } from '../domain/repositories/rolo.repository';

@Injectable()
export class RoleInfrastructure
  extends BaseInfrastructure<RoleModel>
  implements RoleRepository
{
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(roleRepository);
  }
  override async insert(entity: RoleEntity): Promise<Result<RoleEntity>> { 
    const name = await this.roleRepository.findOne({
      where: { name: entity.name },
    });
    if (!name) {
      const data = await this.roleRepository.save(entity);
      return ResponseDto<RoleEntity>(Trace.TraceId(), data);
    } else {
      throw new ForbiddenException('El nombre del rol ya existe');
    }
  }
  async findByIds(ids: number[]): Promise<RoleEntity[]> {
    const result = await this.roleRepository.findBy({ id: In(ids) });

    return result;
  }
}
