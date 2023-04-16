import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/middlewares/auth/jwt.auth.guard';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
