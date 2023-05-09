import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Module } from '@prisma/client';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Module[]> {
    return await this.prisma.module.findMany();
  }

  async findOne(id: number): Promise<Module> {
    return await this.prisma.module.findUnique({
      where: { id },
    });
  }

  async create(data: CreateModuleDto): Promise<Module> {
    return await this.prisma.module.create({
      data,
    });
  }

  async update(id: number, data: UpdateModuleDto) {
    return await this.prisma.module.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    return await this.prisma.module.delete({ where: { id } });
  }

  async findBy(key: string, value: any, id: number = null): Promise<any> {
    const where = { [key]: value };

    if (id) {
      where.id = { not: id };
    }

    return await this.prisma.module.findFirst({
      where,
    });
  }
}
