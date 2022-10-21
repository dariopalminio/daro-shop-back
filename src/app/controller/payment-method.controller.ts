import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException, Param } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { IPaymentMethodService } from 'src/domain/service/interface/payment-method.service.interface';
import { IPaymentMethod } from 'src/domain/model/payment/payment-method.interface';

@Controller('payment/methods')
export class PaymentMethodController {

  constructor(
    @Inject('IPaymentMethodService')
    private readonly paymentMethodService: IPaymentMethodService<IPaymentMethod>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }

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
      element = await this.paymentMethodService.getByQuery({key: key});
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!element) throw new NotFoundException('Payment Method does not exist!');
    return res.status(HttpStatus.OK).json(element);
  };

  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Post('create')
  async create(@Res() res, @Body() paymentMethodDTO: IPaymentMethod) {
    console.log("create-->shippingPriceDTO:", paymentMethodDTO);
    const objCreated = await this.paymentMethodService.create(paymentMethodDTO);
    if (!objCreated) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Created Successfully',
      order: objCreated
    });
  };

  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    const objDeleted = await this.paymentMethodService.delete(id);
    if (!objDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Deleted Successfully',
      deleted: objDeleted
    });
  };

};