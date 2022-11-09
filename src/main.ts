import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupDocModule } from './common/infrastructure/document/setup-doc-module';
require('dotenv').config();
import { join } from 'path';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  console.log('Nest factory start');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
    },
  });

  //CORS proxy to avoid “No Access-Control-Allow-Origin header” problems
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe()); //used to validations with class-validator

  app.useStaticAssets(join(__dirname, '..', '/public/img'), {
    prefix: '/public/img',
  });

  console.log('SET app route', process.env.SERVER_BFF_PREFIX_ROUTE);

  if (!process.env.SERVER_BFF_PREFIX_ROUTE) throw new Error('The env variable named SERVER_BFF_PREFIX_ROUTE is undefined');
  app.setGlobalPrefix(process.env.SERVER_BFF_PREFIX_ROUTE);

  console.log('load swagger module');
  setupDocModule(app);

  console.log("Server running in port:", process.env.SERVER_BFF_PORT);
  if (!process.env.SERVER_BFF_PORT) throw new Error('The env variable named SERVER_BFF_PORT is undefined');
  await app.listen(process.env.SERVER_BFF_PORT);

  const url =`${process.env.SERVER_BFF_DOMAIN}:${process.env.SERVER_BFF_PORT}${process.env.SERVER_BFF_PREFIX_ROUTE}`;
  console.log("Server running in:", url);


}
bootstrap();
