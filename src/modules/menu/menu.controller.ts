import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './application/dto/create-menu.dto';
import { UpdateMenuDto } from './application/dto/update-menu.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MatchQueryPipe } from 'src/common/match-query.pipe';
import { JwtAuthGuard } from 'src/common/middlewares/auth/jwt.auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto, @Req() req) {
    return this.menuService.create(createMenuDto, req.user);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }
  @Get('fullpage')
  fullpage(@Query(new MatchQueryPipe([])) query) {
    return this.menuService.fullpage(query);
  }
  @Get('tree')
  findAlltree() {
    return this.menuService.findAlltree();
  }
  @Get('treeRole/:id')
  findAlltreeRole(@Param('id') id: string) {
    return this.menuService.findAlltreeRole(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Req() req,
  ) {
    return this.menuService.update(+id, updateMenuDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
