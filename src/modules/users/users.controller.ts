import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/middlewares/auth/jwt.auth.guard';
import { Query, Req, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MatchQueryPipe } from 'src/common/match-query.pipe';
import { PasswordDTO } from './application/dto/password-user-dto';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Express.Multer.File,
    @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto,files);
  }
  @Post('compareFace')
  @UseInterceptors(AnyFilesInterceptor())
  comapare(
    @UploadedFiles() files: Express.Multer.File ,@Req() req) {
    return this.usersService.compareFace(req.user,files);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('fullpage')
  fullpage(@Query(new MatchQueryPipe([])) query) {
    return this.usersService.fullpage(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(+id, req.user);
  }
  @Post('update-password')
  updatePass(@Body() PasswordDTO: PasswordDTO) {
    return this.usersService.upatePassword(PasswordDTO);
  }
}
