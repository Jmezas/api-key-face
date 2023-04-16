import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './application/dto/create-auth.dto'; 
import { ApiTags } from '@nestjs/swagger';
 
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('get-new-access-token/:refreshToken')
  getNewAccessToken(@Param('refreshToken') refreshToken: string) {
    return this.authService.getNewAccessToken(refreshToken);
  }

  @Get('getEmail/:email')
  getFindEmail(@Param('email') email: string) {
    return this.authService.getemail(email);
  }
  
}
