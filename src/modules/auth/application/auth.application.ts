import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'src/helpers/logging.helper';
import { Trace } from 'src/helpers/trace.helper';
import { BaseRepository } from 'src/modules/shared/domain/repositories/base-repository';
import { AuthModel } from '../domain/models/auth.model';
import { AuthRepository } from '../domain/repositories/auth.repository';

@Injectable()
export class AuthApplication {
  constructor(
    @Inject(BaseRepository)
    readonly repository: AuthRepository,
  ) {}

  login(auth: AuthModel) {
    Logger.getLogger().info({
      typeElement: 'loginApplication',
      typeAction: 'login',
      traceId: Trace.TraceId(true),
      message: 'access token',
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    return this.repository.login(auth);
  }

  getNewAccessToken(refreshToken: string) {
    Logger.getLogger().info({
      typeElement: 'loginApplication',
      typeAction: 'accessToken',
      traceId: Trace.TraceId(true),
      message: 'new access token',
      query: JSON.stringify(refreshToken),
      datetime: new Date(),
    });
    return this.repository.getNewAccessToken(refreshToken);
  }
  getemail(email: string) {
    Logger.getLogger().info({
      typeElement: 'loginApplication',
      typeAction: 'email',
      traceId: Trace.TraceId(true),
      message: 'send email',
      query: JSON.stringify(email),
      datetime: new Date(),
    });
    return this.repository.findbyEmail(email);
  }
}
