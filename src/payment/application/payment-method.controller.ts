import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException, Param, HttpException } from '@nestjs/common';
import { Roles } from '../../common/application/auth-guard/roles.decorator';
import { RolesGuard } from '../../common/application/auth-guard/roles.guard';
import { IPaymentMethodService } from 'src/payment/domain/payment-method.service.interface';
import { RolesEnum } from 'src/auth/domain/model/reles.enum';
import { PaymentMethod } from 'src/payment/domain/model/payment-metod';
import { PaymentMethodDTO } from './payment-method.dto';
import { IAppErrorHandler, IGlobalConfig } from "hexa-three-levels";
import { AppNestErrorHandler } from '../../common/application/app-error-handler';

/**
 * Payment controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('payment/methods')
export class PaymentMethodController {

  appErrorHandler: IAppErrorHandler<HttpException>;
  
  constructor(
    @Inject('IPaymentMethodService')
    private readonly paymentMethodService: IPaymentMethodService<PaymentMethod>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { 
    this.appErrorHandler = new AppNestErrorHandler();
  }

  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    if (pageParam && limitParam && orderBy && isAsc) {
      const page: number = parseInt(pageParam);
      const limit: number = parseInt(limitParam);
      const orderByField: string = orderBy.toString();
      const isAscending: boolean = (isAsc === 'true') ? true : false;
      const list = await this.paymentMethodService.getAll(page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(list);
    } else {
      const list = await this.paymentMethodService.getAll();
      return res.status(HttpStatus.OK).json(list);
    }
  };

  @Get('/key/:key')
  async getPaymentMethodByKey(@Res() res, @Param('key') key) {
    if (!key) throw new BadRequestException('Param key not specified!');
    let element: any;
    try {
      element = await this.paymentMethodService.getByQuery({ key: key });
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!element) throw new NotFoundException('Payment Method does not exist!');
    return res.status(HttpStatus.OK).json(element);
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async create(@Res() res, @Body() paymentMethodDTO: PaymentMethodDTO) {
    let objCreated;
    try {
      objCreated = await this.paymentMethodService.create(paymentMethodDTO);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!objCreated) throw new NotFoundException('Problem in creation!');
    return res.status(HttpStatus.OK).json({
      message: 'Payment Method Created Successfully',
      order: objCreated
    })
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete')
  async delete(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    try {
      const objDeleted = await this.paymentMethodService.delete(id);
      if (!objDeleted) throw new Error('Does not exist or canot delete!');
      return res.status(HttpStatus.OK).json({
        message: 'Payment Method Deleted Successfully',
        deleted: objDeleted
      })
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
  };

  @Put('update')
  async update(@Res() res, @Body() paymentMethodDTO: PaymentMethodDTO) {
    let paymentMethod: PaymentMethod;
    try {
      paymentMethod = new PaymentMethod(paymentMethodDTO);
    } catch (error) {
      throw new BadRequestException('Payment Method data malformed:' + error.message);
    }
    const query = { key: paymentMethod.getKey() };
    let updatedObj;
    try {
      updatedObj = await this.paymentMethodService.update(query, paymentMethod);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!updatedObj) throw new NotFoundException('Payment Method does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Payment Method Updated Successfully',
      updated: updatedObj
    })
  };


};