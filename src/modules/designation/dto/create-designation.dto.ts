import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug: string;
}
