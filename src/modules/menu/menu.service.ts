import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './application/dto/create-menu.dto';
import { UpdateMenuDto } from './application/dto/update-menu.dto';
import { Trace } from 'src/helpers/trace.helper';
import { MenuApplication } from './application/menu.application';
import { MenuFactory } from './domain/models/menu.factory';

@Injectable()
export class MenuService {
  constructor(private Application: MenuApplication) {}
  async create(createMenuDto: CreateMenuDto, user: any) {
    try {
      Trace.TraceId(true);
      const menu = new MenuFactory().create(createMenuDto);
      console.log(user);
      menu.createdUser = +user.userId;
      const result = await this.Application.add(menu);
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

  async update(id: number, updateMenuDto: UpdateMenuDto, user: any) {
    Trace.TraceId(true);
    const productToInsert = { id: id, ...updateMenuDto };
    const product = new MenuFactory().create(productToInsert);
    product.updatedUser = +user.userId;
    product.updatedAt = new Date();
    const result = await this.Application.update(product, {}, []);
    return result;
  }

  async remove(id: number) {
    return `This action removes a #${id} menu`;
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
  async findAlltree() {
    try {
      Trace.TraceId(true);
      const result = await this.Application.findTree({});
      return result;
    } catch (error) {
      throw new HttpException('message', 400, {
        cause: new Error(error),
      });
    }
  }
  async findAlltreeRole(id: string) {
    try {
      Trace.TraceId(true);
      const result = await this.Application.findMenuRole({ id: id });
      return result;
    } catch (error) {
      throw new HttpException('message', 400, {
        cause: new Error(error),
      });
    }
  }
}
