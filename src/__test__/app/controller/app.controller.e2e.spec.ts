import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpModule } from '@nestjs/axios';
import { AppController } from '../../../app/controller/app.controller';
import { TranslatorNestjsI18nImpl } from '../../../infra/i18n/translator-nestjs-i18n-impl';
import { I18nModuleConfig } from '../../../infra/i18n/i18n-module-config';
import { GlobalConfigImpl } from '../../../infra/config/global-config-impl';
import { IGlobalConfig } from '../../../domain/outgoing/global-config.interface';
import { ITranslator } from '../../../domain/outgoing/translator.interface';
import { TerminusModule } from '@nestjs/terminus';

describe('E2E test, AppController status test', () => {
  let appController: INestApplication;

  beforeAll(async () => {

    // Dependency injection for testing
    const testingModuleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TerminusModule,
        HttpModule,
        I18nModuleConfig,
      ],
      controllers: [AppController],
      providers: [
        {
        provide: 'ITranslator',
        useClass: TranslatorNestjsI18nImpl,
      },
      {
        provide: 'IGlobalConfig',
        useClass: GlobalConfigImpl,
      },
    ],
    }).compile();

    appController = testingModuleRef.createNestApplication();
    //app.use(new AuthMiddleware().use); // auth middleware
    await appController.init();
  });

  it(`/GET app wold be return 200 and data object with isSuccess=true`, async () => {
    const response = await request(appController.getHttpServer()).get('/');
    expect(response.status).toBe(200); //chack status
    expect(response.body.isSuccess).toBe(true); //chack data
    return response;
  }
  );

  afterAll(async () => {
    await appController.close();
  });

});