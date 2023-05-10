import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Designation } from '@prisma/client';
import { PaginationResult } from 'src/common/interface/pagination-result.interface';
import { FilterDesignationDto } from './dto/filter-designation.dto';

@Controller('designations')
@ApiTags('Designations')
@ApiBearerAuth()
export class DesignationController {
  constructor(private readonly designation: DesignationService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designation.create(createDesignationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query() query: FilterDesignationDto,
  ): Promise<PaginationResult<Designation>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const where: any = { deletedAt: null };

    if (query.title) {
      where.title = { contains: query.title };
    }

    if (query.parentId) {
      where.parentId = { contains: query.parentId };
    }

    return await this.designation.findAll(page, limit, where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designation.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designation.update(+id, updateDesignationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designation.remove(+id);
  }
}
