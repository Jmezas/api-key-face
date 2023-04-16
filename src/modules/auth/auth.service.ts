import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './application/dto/create-auth.dto'; 
import { Logger } from 'src/helpers/logging.helper';
import { Trace } from 'src/helpers/trace.helper';
import { AuthApplication } from './application/auth.application';
import { sendEMail } from './domain/models/formatHTML';
import { transporter } from 'src/helpers/mailer';

@Injectable()
export class AuthService {
  constructor(
    private application: AuthApplication,
    private sendEMail: sendEMail,
  ) {}
  async login(createAuthDto: CreateAuthDto) {
    Logger.getLogger().info({
      typeElement: 'loginService',
      typeAction: 'login',
      traceId: Trace.TraceId(true),
      message: 'access token',
      query: JSON.stringify({}),
      datetime: new Date(),
    });
    const email = createAuthDto.email;
    const password = createAuthDto.password;
    const result = await this.application.login({ email, password });
    return result;
  }

  async getNewAccessToken(refreshToken: string) {
    Logger.getLogger().info({
      typeElement: 'loginService',
      typeAction: 'NewToken',
      traceId: Trace.TraceId(true),
      message: 'new access token ',
      query: JSON.stringify(refreshToken),
      datetime: new Date(),
    });
    const result = await this.application.getNewAccessToken(refreshToken);
    return result;
  }
  async getemail(email: string) {
    Logger.getLogger().info({
      typeElement: 'loginService',
      typeAction: 'email',
      traceId: Trace.TraceId(true),
      message: 'send email',
      query: JSON.stringify(email),
      datetime: new Date(),
    });
    const result = await this.application.getemail(email);

    await transporter.sendMail({
      from: '"SISTEMA ERP 👻" ', // sender address
      to: email, // list of receivers
      subject: 'Recuperar contraseña ✔', // Subject line
      //text: 'Hello world?', // plain text body
      html: this.sendEMail.sendEmail(result.payload.data), // html body
    });

    return result;
  }
}
