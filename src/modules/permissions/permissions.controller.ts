import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
@ApiTags('Permission')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() data: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(data);
  }

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionsService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.delete(Number(id));
  }
}
