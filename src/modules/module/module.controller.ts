import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Module')
@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  async create(@Body() data: CreateModuleDto) {
    const { title } = data;

    if (await this.moduleService.findBy('title', title)) {
      throw new BadRequestException('Module name already taken');
    }

    return await this.moduleService.create(data);
  }

  @Get()
  async findAll() {
    return await this.moduleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.moduleService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateModuleDto) {
    const { title } = data;

    if (await this.moduleService.findBy('title', title, +id)) {
      throw new BadRequestException('Module name already taken');
    }

    return await this.moduleService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.moduleService.remove(+id);
  }
}
