import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './application/dto/create-role.dto';
import { UpdateRoleDto } from './application/dto/update-role.dto';
import { JwtAuthGuard } from 'src/common/middlewares/auth/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Query, Req, UseGuards } from '@nestjs/common/decorators';
import { MatchQueryPipe } from 'src/common/match-query.pipe';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Req() req) {
    return this.rolesService.create(createRoleDto, req.user);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
  @Get('fullpage')
  fullpage(@Query(new MatchQueryPipe([])) query) {
    return this.rolesService.fullpage(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
