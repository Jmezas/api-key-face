import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/modules/roles/domain/models/role.entity';
import { ResponseDto } from 'src/modules/shared/application/interfaces/dtos/response.dto';
import Result from 'src/modules/shared/application/interfaces/result.interface';
import { Trace } from 'src/helpers/trace.helper';
import { UserEntity } from 'src/modules/users/domain/models/user.entity';
import { PasswordService } from 'src/modules/users/domain/services/password.service';
import { In, Repository } from 'typeorm';
import { AuthModel, MenuModel } from '../domain/models/auth.model';
import { TokensModel } from '../domain/models/tokens.model';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { EmailModel } from '../domain/models/email';
import { DataItem, TreeNode } from '../domain/models/menu.interface';
import { Logger } from 'src/helpers/logging.helper';
@Injectable()
export class AuthInfrastructure implements AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly RoleEntitypository: Repository<RoleEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async login(auth: AuthModel): Promise<Result<TokensModel>> {
    Logger.getLogger().info({
      typeElement: 'loginInfrastructure',
      typeAction: 'login',
      traceId: Trace.TraceId(true),
      message: 'access token',
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    const user = await this.UserRepository.findOne({
      where: { email: auth.email },
      relations: ['roles'],
    });
    const roles = await this.RoleEntitypository.findOne({
      where: { id: In(user.roles.map((role) => role.id)) },
      relations: ['menus'],
    });
    console.log(JSON.stringify(user));

    if (user) {
      const isPasswordValid = await PasswordService.compareArgon(
        auth.password,
        user.password,
      );
      if (isPasswordValid) {
        const accessToken = this.jwtService.sign({
          id: user.id,
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          imageURL: user.imageURL,
          roles: user.roles.map((role) => role.name),
          menu: this.createTree(roles.menus as any) as any,
        });

        return ResponseDto(Trace.TraceId(), {
          accessToken,
          refreshToken: user.refreshToken,
        });
      } else {
        throw new UnauthorizedException('Invalid email or password', '0001');
      }
    } else {
      throw new UnauthorizedException('Invalid email or password', '0001');
    }
  }
  async getNewAccessToken(refreshToken: string): Promise<Result<TokensModel>> {
    Logger.getLogger().info({
      typeElement: 'loginInfrastructure',
      typeAction: 'accesstoken',
      traceId: Trace.TraceId(true),
      message: 'access token refresh',
      query: JSON.stringify(refreshToken),
      datetime: new Date(),
    });
    const user = await this.UserRepository.findOne({
      where: { refreshToken, status: true },
      relations: ['roles'],
    });
    const roles = await this.RoleEntitypository.findOne({
      where: { id: In(user.roles.map((role) => role.id)) },
      relations: ['menus'],
    });

    if (user) {
      const tokens = this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        imageURL: user.imageURL,
        roles: user.roles.map((role) => role.name),
        menu: this.createTree(roles.menus as any),
      });

      user.refreshToken = uuidv4();

      const dataToken = {
        accessToken: tokens,
        refreshToken: user.refreshToken,
      };

      await this.UserRepository.save(user);

      return ResponseDto(Trace.TraceId(), dataToken);
    } else {
      throw new NotFoundException('Not fun user', 'S004');
    }
  }

  async findbyEmail(email: string): Promise<Result<EmailModel>> {
    Logger.getLogger().info({
      typeElement: 'loginInfrastructure',
      typeAction: 'email',
      traceId: Trace.TraceId(true),
      message: 'send email',
      query: JSON.stringify(email),
      datetime: new Date(),
    });
    const user = await this.UserRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('No existe usuario con ese email');
    }
    const pass = uuidv4();
    user.password = await PasswordService.hashPasswordArgon(pass);

    await this.UserRepository.save(user);
    user.password = pass;
    delete user.refreshToken;
    delete user.status;
    delete user.createdAt;
    delete user.updatedAt;
    return ResponseDto(Trace.TraceId(), user);
  }

  createTree(data: DataItem[]): TreeNode[] {
    const elementsMap = new Map<number, TreeNode>();

    data.forEach((item) => {
      const treeNode: TreeNode = {
        id: item.id,
        title: item.name,
        path: item.path,
        type: item.type,
        icon: item.icon,
        order: item.order,
      };
      if (treeNode.path == null || treeNode.path == '') {
        delete treeNode.path;
      }
      elementsMap.set(item.id, treeNode);
    });

    data.forEach((item) => {
      const childNode = elementsMap.get(item.id);

      if (item.code_menu && elementsMap.has(item.code_menu)) {
        const parentNode = elementsMap.get(item.code_menu);

        if (!parentNode.children) {
          parentNode.children = [];
        }

        parentNode.children.push(childNode);
      }
    });

    return data
      .filter((item) => !item.code_menu)
      .map((item) => elementsMap.get(item.id));
  }
}
