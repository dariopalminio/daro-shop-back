import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../app/controller/app.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ITranslator } from '../../../domain/infra-interface/translator.interface';
import { IGlobalConfig } from '../../../domain/infra-interface/global-config.interface';
import { TerminusModule } from '@nestjs/terminus';

// Stub for i18n traslator
export class TranslatorHelloWorldStub implements ITranslator {

  constructor(
  ) { }

  async translate(key: any, options?: any): Promise<string> {
    return "Hello world!";
  }

};

// Global config Mock
export class GlobalConfigMock implements IGlobalConfig{
    
  variables: Map<string, any> = new Map();

  constructor(
  ) { 
      this.set('APP_NAME', "App name test" as string);
      this.set('VERSION', "v1 test" as string);
  };

  get<R>(key: string): R {
      return this.variables.get(key) as R;
  };

  set<R>(key: string, value: R): void {
      this.variables.set(key,value);
  };

  stringify(): string {
    return JSON.stringify(Object.fromEntries(this.variables)); 
  };

};

describe('Unit test, AppController response test', () => {
  let appController: AppController;

  beforeEach(async () => {
    // Dependency injection for testing
    const testingModuleRef: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [AppController],
      providers: [{
        provide: 'ITranslator',
        useClass: TranslatorHelloWorldStub,
      },
      {
        provide: 'IGlobalConfig',
        useClass: GlobalConfigMock,
      },
    ],
    }).compile();

    appController = testingModuleRef.get<AppController>(AppController);
   
  });

  it('/GET app should return "Hello world!"', async () => {

    const headersParam = {
      lang: 'en',
    };

    let resParamMock = {
      send: function () { },
      json: function (d) {
        console.log("\n json: " + JSON.stringify(d));
        expect(d.message).toEqual("Hello world!");
      },
      status: function (s) {
        this.statusCode = s;
        //console.log("\n this.statusCode: " + this.statusCode);;
        return this;
      }
    };

    expect(await appController.getHello(headersParam, resParamMock)).toBeCalled;
  });

});

describe('[Unit test] AppController status test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // Dependency injection for testing
    const testingModuleRef: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [AppController],
      providers: [{
        provide: 'ITranslator',
        useClass: TranslatorHelloWorldStub,
      },
      {
        provide: 'IGlobalConfig',
        useClass: GlobalConfigMock,
      },],
    }).compile();

    app = testingModuleRef.createNestApplication();
    await app.init();
  });

  it(`/GET app wold be return 200`, () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  }
  );

  afterAll(async () => {
    await app.close();
  });

});