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



#### Help Links
[Nestjs/config](https://javascript.plainenglish.io/nestjs-how-to-store-read-and-validate-environment-variable-using-nestjs-config-40a5fa0702e4)