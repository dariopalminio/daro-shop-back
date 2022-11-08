
import { Module, OnModuleInit, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsAllFilter } from 'src/application/filter/exception.filter';
import { AppController } from 'src/application/controller/app.controller';
import { NotificationController } from 'src/application/controller/notification.controller';
import { ProductController } from 'src/application/controller/product.controller';
import { CategoryController } from 'src/application/controller/category.controller';
import { NotificationService } from 'src/domain/service/notification.service';
import { ProductService } from 'src/domain/service/product.service';
import { CategoryService } from 'src/domain/service/category.service';
import { AuthService } from 'src/domain/service/auth.service';
import { UserService } from 'src/domain/service/user.service';
import { UserController } from 'src/application/controller/user.controller';
import { AuthController } from 'src/application/controller/auth.controller';
import { EmailSmtpSenderAdapter } from 'src/infrastructure/email/email-sender.adapter';
import { AuthMiddleware } from 'src/application/middleware/auth.middleware';
import { ProductSchema } from 'src/infrastructure/database/schema/product.schema';
import { UserSchema } from 'src/infrastructure/database/schema/user.schema';

import { CategorySchema } from 'src/infrastructure/database/schema/category.schema';
import DB_CONNECTION from 'src/infrastructure/database/db-connection';
import {
  UserRepository
} from 'src/infrastructure/database/repository/user.repository';
import {
  CategoryRepository
} from 'src/infrastructure/database/repository/category.repository';
import {
  ProductRepository
} from 'src/infrastructure/database/repository/product.repository';
import LoggerHelper from 'src/infrastructure/logger/logger.helper';

import { GlobalConfigImpl } from 'src/infrastructure/config/global-config-impl';

//Mongo
import { MongooseModule } from '@nestjs/mongoose';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { AuthTokensController } from './controller/auth.token.controller';
import { AuthTokensService } from 'src/domain/service/auth.tokens.service';

import { join } from 'path';
import { ProfileSchema } from 'src/infrastructure/database/schema/profile.schema';
import { ProfileRepository } from 'src/infrastructure/database/repository/profile.repository';
import { ProfileController } from 'src/application/controller/profile.controller';
import { ProfileService } from 'src/domain/service/profile.service';
import { ShippingPriceService } from 'src/domain/service/shipping-price.service';
import { ShippingPriceController } from 'src/application/controller/shipping-price.controller';
import { ShippingPriceSchema } from 'src/infrastructure/database/schema/shipping-price.schema';
import { ShippingPriceRepository } from 'src/infrastructure/database/repository/shipping-price.repository';
import { OrderRepository } from 'src/infrastructure/database/repository/order.repository';
import { OrderService } from 'src/domain/service/order.service';
import { OrderController } from 'src/application/controller/order.controller';
import { OrderSchema } from 'src/infrastructure/database/schema/order.schema';
import { PaymentMethodSchema } from 'src/infrastructure/database/schema/payment-method.schema';
import { PaymentMethodRepository } from 'src/infrastructure/database/repository/payment-method.repository';
import { PaymentMethodService } from 'src/domain/service/payment-method.service';
import { PaymentMethodController } from 'src/application/controller/payment-method.controller';

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
    ProductController, CategoryController, ShippingPriceController, OrderController, PaymentMethodController],
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
