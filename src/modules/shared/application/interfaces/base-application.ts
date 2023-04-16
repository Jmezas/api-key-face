import { Logger } from 'src/helpers/logging.helper';
import { Trace } from 'src/helpers/trace.helper';
import { BaseRepository } from '../../domain/repositories/base-repository';
import { DTOAbstract } from './dtos/abstract.dto';
import Result from './result.interface';

export class BaseApplication<T> {
  constructor(
    private repository: BaseRepository<T, number>,
    private dto: DTOAbstract<T>,
    private applicationName: string = null,
  ) {}
  async add(entity: T): Promise<Result<T>> {
    try {
      Logger.getLogger().info({
        typeElement: this.applicationName,
        typeAction: 'cretate',
        traceId: Trace.TraceId(true),
        message: 'create ' + this.applicationName,
        query: JSON.stringify({}),
        datetime: new Date(),
      });
      const result = await this.repository.insert(entity);
      return this.dto.mapping(result);
    } catch (error) {
      throw new Error(error);
    }
  }
  async update(
    entity: T,
    where: object,
    relations: string[],
  ): Promise<Result<T>> {
    Logger.getLogger().info({
      typeElement: this.applicationName,
      typeAction: 'update',
      traceId: Trace.TraceId(true),
      message: 'update ' + this.applicationName,
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    const result = await this.repository.update(entity, where, relations);
    return this.dto.mapping(result);
  }
  async delete(where: object, userId: number): Promise<Result<T>> {
    Logger.getLogger().info({
      typeElement: this.applicationName,
      typeAction: 'delete',
      traceId: Trace.TraceId(true),
      message: 'delete ' + this.applicationName,
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    const result = await this.repository.delete(where, userId);
    return this.dto.mapping(result);
  }
  async findByOne(where: object, relations: string[]): Promise<Result<T>> {
    Logger.getLogger().info({
      typeElement: this.applicationName,
      typeAction: 'findByOne',
      traceId: Trace.TraceId(true),
      message: 'findByOne ' + this.applicationName,
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    const result = await this.repository.findByOne(where, relations);
    return this.dto.mapping(result);
  }
  async findAll(
    where: { [s: string]: string | number | boolean | object },
    relations: string[],
    order: { [s: string]: string },
  ): Promise<Result<T>> {
    Logger.getLogger().info({
      typeElement: this.applicationName,
      typeAction: 'list',
      traceId: Trace.TraceId(true),
      message: 'List all ' + this.applicationName + 's',
      query: JSON.stringify({}),
      datetime: new Date(),
    });

    const result = await this.repository.findAll(where, relations, order);
    return this.dto.mapping(result);
  }
  async getPage(
    page: number,
    pagesize: number,
    where: { [s: string]: string | number | boolean },
    relations: string[],
    order: { [s: string]: string },
  ) {
    Logger.getLogger().info({
      typeElement: this.applicationName,
      typeAction: 'getPage',
      traceId: Trace.TraceId(true),
      message: 'getPage ' + this.applicationName + 's',
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    return await this.repository.getPage(
      page,
      pagesize,
      where,
      relations,
      order,
    );
  }
}
