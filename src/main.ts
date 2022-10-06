import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { setupDocModule } from './infra/document/setup-doc-module';
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

  app.useStaticAssets(join(__dirname, '..', '/public/img'), {
    prefix: '/public/img',
  });

  console.log('SET app route', process.env.SERVER_BFF_PREFIX_ROUTE);
  app.setGlobalPrefix(process.env.SERVER_BFF_PREFIX_ROUTE);

  console.log('load swagger module');
  setupDocModule(app);

  console.log("Server running in port:", process.env.SERVER_BFF_PORT);
  await app.listen(process.env.SERVER_BFF_PORT);

  const url =`${process.env.SERVER_BFF_DOMAIN}:${process.env.SERVER_BFF_PORT}${process.env.SERVER_BFF_PREFIX_ROUTE}`;
  console.log("Server running in:", url);


}
bootstrap();
