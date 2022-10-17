
import { Module, OnModuleInit, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsAllFilter } from '../app/filter/exception.filter';
import { AppController } from '../app/controller/app.controller';
import { NotificationController } from '../app/controller/notification.controller';
import { ProductController } from '../app/controller/product.controller';
import { CategoryController } from '../app/controller/category.controller';
import { NotificationService } from '../domain/service/notification.service';
import { ProductService } from '../domain/service/product.service';
import { CategoryService } from '../domain/service/category.service';
import { AuthService } from '../domain/service/auth.service';
import { UserService } from '../domain/service/user.service';
import { UserController } from '../app/controller/user.controller';
import { AuthController } from '../app/controller/auth.controller';
import { EmailSmtpSenderAdapter } from '../infra/email/email-sender.adapter';
import { TranslatorNestjsI18nImpl } from '../infra/i18n/translator-nestjs-i18n-impl';
import { AuthMiddleware } from '../app/middleware/auth.middleware';
import { ProductSchema } from '../infra/database/schema/product.schema';
import { UserSchema } from '../infra/database/schema/user.schema';

import { CategorySchema } from '../infra/database/schema/category.schema';
import DB_CONNECTION from '../infra/database/db.connection.string';
import {
  UserRepository
} from '../infra/database/repository/user.repository';
import {
  CategoryRepository
} from '../infra/database/repository/category.repository';
import {
  ProductRepository
} from '../infra/database/repository/product.repository';
import LoggerHelper from '../infra/logger/logger.helper';

import { GlobalConfigImpl } from '../infra/config/global-config-impl';

//Mongo
import { MongooseModule } from '@nestjs/mongoose';
//i18n
import { I18nModuleConfig } from '../infra/i18n/i18n-module-config';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { AuthTokensController } from './controller/auth.token.controller';
import { AuthTokensService } from 'src/domain/service/auth.tokens.service';
//import { I18nRequestScopeService } from 'nestjs-i18n';
import { TranslatorI18nImpl } from 'src/infra/i18n/TraslatorI18Impl';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';
import { ProfileSchema } from 'src/infra/database/schema/profile.schema';
import { ProfileRepository } from 'src/infra/database/repository/profile.repository';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from '../domain/service/profile.service';
import { ShippingController } from './controller/shipping.controller';

console.log("DB_CONNECTION:", DB_CONNECTION);

//Dependency Injector
@Module({
  imports: [
    TerminusModule,
    HttpModule,
    MongooseModule.forRoot(DB_CONNECTION),
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),
    I18nModuleConfig,
    /*ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../../public'),
      exclude: ['/api*'],
      serveStaticOptions:{
        extensions:  ['html', 'jpg', 'png'],
        index: false
      }
    }),*/
  ],
  controllers: [AppController, AuthController, AuthTokensController, UserController, ProfileController, NotificationController, ProductController, CategoryController, ShippingController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: 'IGlobalConfig',
      useClass: GlobalConfigImpl,
    },
    {
      provide: 'ITranslator',
      useClass: TranslatorI18nImpl,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAuthTokensService',
      useClass: AuthTokensService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IProfileService',
      useClass: ProfileService,
    },
    {
      provide: 'INotificationService',
      useClass: NotificationService,
    },
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
    {
      provide: 'IEmailSender',
      useClass: EmailSmtpSenderAdapter,
    },
    {
      provide: 'ICategoryService',
      useClass: CategoryService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsAllFilter,
    },
    {
      provide: 'ILoggerService',
      useClass: LoggerHelper,
    },
  ],
})


export class AppModule implements OnModuleInit {
  constructor(private readonly http: HttpService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude({ path: 'login', method: RequestMethod.POST },
      { path: 'auth/tokens/login', method: RequestMethod.POST },
      { path: '/auth/tokens/login', method: RequestMethod.POST },
      { path: '/auth/tokens/login/', method: RequestMethod.POST },
      )
      .forRoutes(AppController, AuthController, UserController, NotificationController, ProductController, CategoryController);
  };

  onModuleInit() {
    this.http.axiosRef.interceptors.response.use(undefined, (error) => {
      const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

      if (!expectedError) {
        return Promise.reject(error);
      }

      return error.response;
    });
  }
};
