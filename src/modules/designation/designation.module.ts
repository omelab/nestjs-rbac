import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { SlugProvider } from 'src/common/utils/slug.provider';

@Module({
  imports: [PrismaModule],
  controllers: [DesignationController],
  providers: [DesignationService, SlugProvider],
})
export class DesignationModule {}
