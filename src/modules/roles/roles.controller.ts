import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Controller('roles')
@ApiTags('Role')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(AccessTokenGuard, new PermissionGuard('create_role'))
  async create(@Res() res: Response, @Body() data: CreateRoleDto) {
    const role = await this.rolesService.create(data);

    if (role.id) {
      res.status(201).send({ message: 'Role created successfully' });
    }
  }

  @Get()
  @UseGuards(AccessTokenGuard, new PermissionGuard('list_role'))
  async findAll(): Promise<Role[]> {
    return this.rolesService.findMany();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, new PermissionGuard('view_role'))
  async findOne(@Param('id') id: string): Promise<Role | null> {
    return this.rolesService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, new PermissionGuard('edit_role'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, new PermissionGuard('delete_role'))
  async delete(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(Number(id));
  }
}
