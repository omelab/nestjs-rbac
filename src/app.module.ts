import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV && process.env.NODE_ENV == 'development'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      ],
    }),
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    UsersModule,
    PrismaModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
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
