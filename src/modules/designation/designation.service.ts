import { Injectable } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Designation, Prisma } from '@prisma/client';
import { PaginationResult } from 'src/common/interface/pagination-result.interface';
import { SlugProvider } from 'src/common/utils/slug.provider';

@Injectable()
export class DesignationService {
  constructor(
    private readonly prisma: PrismaService,
    private slugProvider: SlugProvider,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    where: Prisma.UserWhereInput = { deletedAt: null },
  ): Promise<PaginationResult<Designation>> {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      this.prisma.designation.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.designation.count({
        where,
      }),
    ]);
    const perPage = data.length;
    const currentPage = page;
    const nextPage = totalCount > skip + perPage ? page + 1 : undefined;

    return {
      data,
      totalCount,
      currentPage,
      perPage,
      nextPage,
    };
  }

  async findOne(id: number) {
    return await this.prisma.designation.findUnique({
      where: { id },
    });
  }

  async create(data: CreateDesignationDto): Promise<any> {
    const slug = await this.slugProvider.slugify(
      data.slug || data.title,
      'designation',
    );
    data.slug = slug;

    return this.prisma.designation.create({
      data,
    });
  }

  async update(id: number, data: UpdateDesignationDto) {
    const slug = await this.slugProvider.slugify(
      data.slug || data.title,
      'designation',
      id,
    );
    data.slug = slug;

    return await this.prisma.designation.update({
      where: { id },
      data: data,
    });
  }

  async softDelete(id: number) {
    return await this.prisma.designation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async remove(id: number) {
    // Remove the designation row
    await this.prisma.designation.delete({ where: { id } });

    // Update any associated user records to set their designationId to null
    await this.prisma.user.updateMany({
      where: { designationId: id },
      data: { designationId: null },
    });
  }
}
