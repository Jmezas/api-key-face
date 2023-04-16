import Result from '../../application/interfaces/result.interface';

export interface BaseRepository<T, U> {
  insert(entity: T): Promise<Result<T>>;
  update(
    entity: Partial<T>,
    where: object,
    relations: string[],
  ): Promise<Result<T>>;
  delete(where: object, userId: number): Promise<Result<T>>;
  findByOne(where: object, relations: string[]): Promise<Result<T>>;
  findAll(
    where: { [s: string]: string | number | boolean | object },
    relations: string[],
    order: { [s: string]: string },
  ): Promise<Result<T>>;

  getPage(
    page: number,
    pagesize: number,
    where: { [s: string]: string | number | boolean },
    relations: string[],
    order: { [s: string]: string },
  ): Promise<Result<T>>;
}
export const BaseRepository = Symbol('BaseRepository');
