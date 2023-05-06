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

  async create(data: CreateUserDto): Promise<any> {
    const { email, username } = data;

    if (username && !(await isUnique('user', 'username', username))) {
      throw new BadRequestException('Username already taken');
    }

    if (email && !(await isUnique('user', 'email', email))) {
      throw new BadRequestException('Email address is already taken');
    }

    //manager roles
    const roles: any = {};
    if (data.roleIds && data.roleIds.length > 0) {
      roles.connect = data.roleIds.map((id) => ({ id }));
    }

    //remove roleId form data
    delete data.roleIds;

    // Hash password
    const hashedPassword: string = await hashData(data.password);
    data.password = hashedPassword;

    return await this.prismaService.user.create({
      data: {
        ...data,
        roles,
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

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const { email, username } = data;

    if (username && !(await isUnique('user', 'username', username, id))) {
      throw new BadRequestException('Username already taken');
    }

    if (email && !(await isUnique('user', 'email', email, id))) {
      throw new BadRequestException('Email address is already taken');
    }

    if (data.password) {
      data.password = await this.hashData(data.password);
    }

    //manager roles
    const roles: any = {};
    if (data.roleIds && data.roleIds.length > 0) {
      roles.connect = data.roleIds.map((id) => ({ id }));
    }

    return await this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
        roles,
      },
    });
  }

  //update refresh token
  async updateRefreshToken(id: number, refreshToken: string): Promise<any> {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        refreshToken,
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
