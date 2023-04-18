import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class PasswordDTO {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password?: string;
  @ApiProperty()
  @IsString()
  passwordUpdate?: string;
}
