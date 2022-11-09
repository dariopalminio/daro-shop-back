import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config();
//import * as fs from 'fs';

/**
 * Setup Swagger to NestJS
 * @param app 
 */
export const setupDocModule = (app: any) => {
  try {
    const docConfig = new DocumentBuilder()
      .setTitle('Api doc ' + process.env.SERVER_BFF_APP_NAME)
      .setDescription('Api as backend')
      //.addBearerAuth()
      .setVersion(process.env.SERVER_BFF_VERSION? process.env.SERVER_BFF_VERSION : '0.1')
      .addTag(process.env.SERVER_BFF_APP_NAME? process.env.SERVER_BFF_APP_NAME : 'Daro 2022')
      .build();
    const document = SwaggerModule.createDocument(app, docConfig, {
      ignoreGlobalPrefix: false,
    });
    //fs.writeFileSync('spec/swagger-spec.json', JSON.stringify(document));
    console.log('Setup swagger in: ' + `${process.env.SERVER_BFF_PREFIX_ROUTE}/doc`);
    SwaggerModule.setup(`${process.env.SERVER_BFF_PREFIX_ROUTE}/doc`, app, document);
  } catch (error) {
    console.log("Error loadin Swagger...");
    console.log(error);
  }
};