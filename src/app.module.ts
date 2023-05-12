import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import winstonConfig from 'src/config/winston';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { DesignationModule } from './modules/designation/designation.module';
import { ModuleModule } from './modules/module/module.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { MediaModule } from './modules/media/media.module';
import { PageModule } from './modules/page/page.module';
import { ContactModule } from './modules/contact/contact.module';
import { EventModule } from './modules/event/event.module';
import { AlbumModule } from './modules/album/album.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      exclude: ['/api*'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DesignationModule,
    ModuleModule,
    CategoryModule,
    TagModule,
    MediaModule,
    PageModule,
    ContactModule,
    EventModule,
    AlbumModule,
    GalleryModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
