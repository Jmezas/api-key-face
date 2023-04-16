import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './application/dto/create-role.dto';
import { UpdateRoleDto } from './application/dto/update-role.dto';
import { RoleApplication } from './application/role.application';
import { RoleFactory } from './domain/models/role.factory';
import { Trace } from 'src/helpers/trace.helper';
@Injectable()
export class RolesService {
  constructor(private Application: RoleApplication) {}
  async create(createRoleDto: CreateRoleDto,user: any) {
    console.log(user);
    try {
      Trace.TraceId(true);
      const role = new RoleFactory().create(createRoleDto);
      role.createdUser = +user.userId;
      const result = await this.Application.add(role);
      return result;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findAll() {
    Trace.TraceId(true);
    const result = await this.Application.findAll({}, [], { id: 'desc' });
    return result;
  }

  async findOne(id: number) {
    Trace.TraceId(true);
    const result = await this.Application.findByOne({ id }, ['menus']);
    return result;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    Trace.TraceId(true);
    const productToInsert = { id: id, ...updateRoleDto };
    const product = new RoleFactory().create(productToInsert);
    // product.updatedUser = +user.userId;
    product.updatedAt = new Date();
    const result = await this.Application.update(product, {}, []);
    return result;
  }

  async remove(id: number) {
    Trace.TraceId(true);
    const result = await this.Application.delete({ id }, 0);
    return result;
  }
  async fullpage(query: any) {
    if (!query.search) {
      delete query.search;
    }
    Trace.TraceId(true);
    const result = await this.Application.getPage(
      query.page,
      query.limit,
      { name: query.search, status: true },
      [],
      { id: 'desc' },
    );
    return result;
  }
}
