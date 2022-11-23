
import { Module, OnModuleInit, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsAllFilter } from 'src/common/application/exception.filter';
import { AppController } from 'src/common/application/app.controller';
import { NotificationController } from 'src/notification/application/notification.controller';
import { ProductController } from 'src/product/application/product.controller';
import { CategoryController } from 'src/product/application/category.controller';
import { NotificationService } from 'src/notification/domain/notification.service';
import { ProductService } from 'src/product/domain/product.service';
import { CategoryService } from 'src/product/domain/category.service';
import { AuthService } from 'src/auth/domain/auth.service';
import { UserService } from 'src/auth/domain/user.service';
import { UserController } from 'src/auth/application/user.controller';
import { AuthController } from 'src/auth/application/auth.controller';
import { EmailSmtpSenderAdapter } from 'src/notification/infrastructure/email/email-sender.adapter';
import { AuthMiddleware } from 'src/common/application/auth-guard/auth.middleware';
import { ProductSchema } from 'src/product/infrastructure/product.schema';
import { UserSchema } from 'src/auth/infrastructure/user.schema';

import { CategorySchema } from 'src/product/infrastructure/category.schema';
import DB_CONNECTION from 'src/common/infrastructure/database/db-connection';
import {
  UserRepository
} from 'src/auth/infrastructure/user.repository';
import {
  CategoryRepository
} from 'src/product/infrastructure/category.repository';
import {
  ProductRepository
} from 'src/product/infrastructure/product.repository';
import LoggerHelper from 'src/common/infrastructure/logger/logger.helper';

import { GlobalConfigImpl } from 'src/common/infrastructure/config/global-config-impl';

//Mongo
import { MongooseModule } from '@nestjs/mongoose';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/application/auth-guard/roles.guard';
import { AuthTokensController } from './auth/application/auth.token.controller';
import { AuthTokensService } from 'src/auth/domain/auth.tokens.service';

import { join } from 'path';
import { ProfileSchema } from 'src/profile/infrastructure/profile.schema';
import { ProfileRepository } from 'src/profile/infrastructure/profile.repository';
import { ProfileController } from 'src/profile/application/profile.controller';
import { ProfileService } from 'src/profile/domain/profile.service';
import { ShippingPriceService } from 'src/shipping/domain/shipping-price.service';
import { ShippingPriceController } from 'src/shipping/application/shipping-price.controller';
import { ShippingPriceSchema } from 'src/shipping/infrastructure/shipping-price.schema';
import { ShippingPriceRepository } from 'src/shipping/infrastructure/shipping-price.repository';
import { OrderRepository } from 'src/order/infrastructure/order.repository';
import { OrderService } from 'src/order/domain/order.service';
import { OrderController } from 'src/order/application/order.controller';
import { OrderSchema } from 'src/order/infrastructure/order.schema';
import { PaymentMethodSchema } from 'src/payment/infrastructure/payment-method.schema';
import { PaymentMethodRepository } from 'src/payment/infrastructure/payment-method.repository';
import { PaymentMethodService } from 'src/payment/domain/payment-method.service';
import { PaymentMethodController } from 'src/payment/application/payment-method.controller';
import { BusinessSchema } from './business/infrastructure/Business.schema';
import { BusinessService } from './business/domain/Business.service';
import { BusinessRepository } from './business/infrastructure/Business.repository';
import { BusinessController } from './business/application/Business.controller';

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
      { name: 'ShippingPrice', schema: ShippingPriceSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'PaymentMethod', schema: PaymentMethodSchema },
      { name: 'BusinessModel', schema: BusinessSchema },
    ]),
    /*ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../../public'),
      exclude: ['/api*'],
      serveStaticOptions:{
        extensions:  ['html', 'jpg', 'png'],
        index: false
      }
    }),*/
  ],
  controllers: [AppController, AuthController, AuthTokensController,
    UserController, ProfileController, NotificationController,
    ProductController, CategoryController, ShippingPriceController, OrderController, PaymentMethodController, BusinessController],
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
      provide: 'IShippingPriceService',
      useClass: ShippingPriceService,
    },
    {
      provide: 'IOrderService',
      useClass: OrderService,
    },
    {
      provide: 'IPaymentMethodService',
      useClass: PaymentMethodService,
    },
    {
      provide: 'IBusinessService',
      useClass: BusinessService,
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
      provide: 'IShippingPriceRepository',
      useClass: ShippingPriceRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IPaymentMethodRepository',
      useClass: PaymentMethodRepository,
    },
    {
      provide: 'IBusinessRepository',
      useClass: BusinessRepository,
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
      .forRoutes(AppController, AuthController, UserController, ProfileController, NotificationController,
        ProductController, CategoryController, ShippingPriceController, OrderController, PaymentMethodController);
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
