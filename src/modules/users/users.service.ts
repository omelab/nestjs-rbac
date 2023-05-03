/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { hashData } from 'src/common/helper/hashData';
import { isUnique } from 'src/common/utils/isUnique';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@prisma/client';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;
}

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const { email, username } = data;

    if (!(await isUnique('user', 'username', username))) {
      throw new BadRequestException('Username already taken');
    }

    if (!(await isUnique('user', 'email', email))) {
      throw new BadRequestException('Email address is already taken');
    }

    //manager roles
    const roleIds = data.roleIds;
    delete data.roleIds;

    // Hash password
    const hashedPassword: string = await hashData(data.password);
    data.password = hashedPassword;

    return await this.prismaService.user.create({
      data: {
        ...data,
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return users;
  }

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number): Promise<any> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        designationId: true,
        designation: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username } = updateUserDto;

    if (!(await isUnique('user', 'username', username, id))) {
      throw new BadRequestException('Username already taken');
    }

    if (!(await isUnique('user', 'email', email, id))) {
      throw new BadRequestException('Email address is already taken');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    //manager roles
    const roleIds = updateUserDto.roleIds;
    delete updateUserDto.roleIds;

    return await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prismaService.user.delete({ where: { id } });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
