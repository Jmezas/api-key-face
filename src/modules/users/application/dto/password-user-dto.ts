import { IsEmail, IsString } from 'class-validator';

export class PasswordDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  passwordUpdate?: string;
}
