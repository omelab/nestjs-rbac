import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';

@Injectable()
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  designationId: number;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(Number)
      : value.split`,`.map((x: any) => +x),
  )
  @IsArray()
  roleIds: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  refreshToken: string;
}
