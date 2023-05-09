import { Injectable } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Designation } from '@prisma/client';

@Injectable()
export class DesignationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.designation.findMany();
  }

  findOne(id: number) {
    return this.prisma.designation.findUnique({
      where: { id },
    });
  }

  async create(data: CreateDesignationDto): Promise<Designation> {
    return this.prisma.designation.create({
      data,
    });
  }

  update(id: number, data: UpdateDesignationDto) {
    return this.prisma.designation.update({
      where: { id },
      data: data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} designation`;
  }
}
