## Installation Nestjs Framework
Creating a new project with the Nest CLI is recommended for first-time users. We'll continue with this approach in [First Steps](https://docs.nestjs.com/first-steps).

After creating the project we need to make configuration
To use the configuration module in your NestJS application, you need to first install the @nestjs/config package:

```bash
npm install --save @nestjs/config
```

Then, you can import the ConfigModule in your root AppModule:

```javascript
//src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:[`.env.${process.env.NODE_ENV ?? 'production'}`],
    }),
  ],
})
export class AppModule {}
```

In the example above, we've set the isGlobal option to true so that the configuration module is available throughout the entire application. We've also specified two environment files to load, .env.development and .env.production.

Next, you can use the ConfigService to access your application's configuration values:

```javascript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
}
```
In the example above, we're using the ConfigService to retrieve the value of the DATABASE_URL configuration variable.

You can also define configuration values in a .env file at the root of your project:

```bash
DATABASE_URL=postgres://localhost:5432/mydb
```
The ConfigService will automatically load these values and make them available to your application.


In the main.js file of your NestJS application, you can access the ConfigService by importing it from the @nestjs/config package and injecting it into your main application instance using the app.use() method. Here's an example:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  await app.listen(port);
}

bootstrap();
```

In the example above, we're first creating an instance of the AppModule using the NestFactory.create() method. We then use the app.get() method to get an instance of the ConfigService, which we can use to retrieve the value of the PORT configuration variable.

Note that this assumes that you've already imported the ConfigModule into your AppModule as described in my previous answer. If you haven't done so already, you'll need to add the following import statement to the top of your AppModule file:

```typescript
import { ConfigModule } from '@nestjs/config';
```

and then import it into your AppModule's imports array like this:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### Help Links
[Nestjs/config](https://javascript.plainenglish.io/nestjs-how-to-store-read-and-validate-environment-variable-using-nestjs-config-40a5fa0702e4)