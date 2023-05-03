import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Controller('roles')
@ApiTags('Role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role | null> {
    return this.rolesService.findOne(Number(id));
  }

  @Post()
  async create(@Res() res: Response, @Body() data: CreateRoleDto) {
    const role = await this.rolesService.create(data);

    if (role.id) {
      res.status(201).send({ message: 'Role created successfully' });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(Number(id));
  }
}
