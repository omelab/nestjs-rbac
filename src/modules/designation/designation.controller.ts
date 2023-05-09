import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

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
  async findAll() {
    return this.designation.findAll();
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
