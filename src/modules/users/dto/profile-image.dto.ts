import { ApiProperty } from '@nestjs/swagger';

export class ProfileImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
