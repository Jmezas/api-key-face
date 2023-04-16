import { TypeOrmModuleOptions } from '@nestjs/typeorm'; 
require('dotenv').config();
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('DATABASE_HOST') ?? 'localhost',
      port: parseInt(this.getValue('DATABASE_PORT')) ?? 5200,
      username: this.getValue('DATABASE_USER') ?? 'user',
      password: this.getValue('DATABASE_PASSWORD') ?? 'pssql',
      database: this.getValue('DATABASE_DATABASE') ?? 'postgres',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_DATABASE',
]);

export { configService };
