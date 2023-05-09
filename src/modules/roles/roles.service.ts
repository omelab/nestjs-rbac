import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            id: true,
            name: true,
            module: {
              select: {
                title: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateRoleDto): Promise<Role> {
    const permissionIds = data.permissionIds;
    delete data.permissionIds;

    const role = await this.prisma.role.create({
      data: {
        ...data,
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
    });

    return role;
  }

  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const permissionIds = data.permissionIds;
    delete data.permissionIds;

    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: number): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
