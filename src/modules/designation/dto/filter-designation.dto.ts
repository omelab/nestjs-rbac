import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterDesignationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((val) => parseInt(val.value))
  parentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((val) => parseInt(val.value))
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((val) => parseInt(val.value))
  limit: number;
}
