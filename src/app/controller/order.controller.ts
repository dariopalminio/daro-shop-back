import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { IOrderService } from 'src/domain/service/interface/order.service.interface';
import { IOrder } from 'src/domain/model/order/order.interface';
import { Order } from 'src/domain/model/order/order';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { OrderToInitializeDTO } from '../dto/order-to-initialize.dto';
import { OrderToCreateDTO } from '../dto/order-to-create.dto';

/**
 * Order controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('orders')
export class OrderController {

  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService<IOrder>,
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
      const list = await this.orderService.getAll(page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(list);
    } else {
      const list = await this.orderService.getAll();
      return res.status(HttpStatus.OK).json(list);
    }
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async create(@Res() res, @Body() orderToCreateDTO: OrderToCreateDTO) {
    let orderDTO: IOrder;
    try {
      orderDTO = orderToCreateDTO;
      this.validateOrderParam(orderDTO);
    } catch (error) {
      throw new BadRequestException('Order data malformed:' + error.message);
    }

    const objCreated = await this.orderService.create(orderDTO);
    if (!objCreated) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Created Successfully',
      order: objCreated
    });
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    const objDeleted = await this.orderService.delete(id);
    if (!objDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Deleted Successfully',
      objDeleted
    });
  };

  @Post('initialize')
  async initialize(@Res() res, @Body() orderToInitializeDTO: OrderToInitializeDTO) {
    let order: IOrder;
    try {
      order = orderToInitializeDTO;
      this.validateOrderParam(order);
    } catch (error) {
      throw new BadRequestException('Order data malformed:' + error.message);
    }
    try {
      const orderCreated = await this.orderService.initialize(order);
      return res.status(HttpStatus.OK).json({
        message: 'Order Initialized Successfully',
        order: orderCreated
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  };

  @Put('confirm')
  async confirm(@Res() res, @Body() body: any, @Query('orderId') orderId) {
    if (!orderId) throw new BadRequestException('orderId not specified!');
    try {
      await this.orderService.confirm(orderId);
      return res.status(HttpStatus.OK).json({
        message: 'Order Confirmed Successfully',
        orderId: orderId
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  };

  @Put('abort')
  async abort(@Res() res, @Body() body: any, @Query('orderId') orderId) {
    if (!orderId) throw new BadRequestException('orderId not specified!');
    try {
      await this.orderService.abort(orderId);
      return res.status(HttpStatus.OK).json({
        message: 'Order Aborted Successfully',
        orderId: orderId
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  };

  @Put('pay')
  async completePayment(@Res() res, @Body() body: any, @Query('orderId') orderId) {
    if (!orderId) throw new BadRequestException('orderId not specified!');
    try {
      await this.orderService.completePayment(orderId);
      return res.status(HttpStatus.OK).json({
        message: 'Order Paid Successfully',
        orderId: orderId
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  };

  /**
   * Validation of Order (plainToClass)
   * Note: Data should always be assumed to be bad until it’s been through some kind of validation process. 
   * In the future move this validation to a validatable object!
   */
  private validateOrderParam(orderParam: IOrder): IOrder {
    const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const hasClientEmail: boolean = expresionsRegularEmail.test(orderParam.client.email);
    if (!hasClientEmail) throw new Error('Field email has invalid format!');
    if (!orderParam.orderItems || orderParam.orderItems.length === 0) throw new Error('This order has no product items');
    const hasAnArray: boolean = Array.isArray(orderParam.orderItems);
    if (!hasAnArray) throw new Error('The order has no items. The field named orderItems is no an Array!');
    if (isNaN(orderParam.count)) throw new Error('Casting error: quantity field is not a number!');
    let newObj: IOrder = new Order();
    newObj.client = orderParam.client;
    newObj.orderItems = orderParam.orderItems;
    newObj.count = orderParam.count;
    newObj.includesShipping = orderParam.includesShipping;
    newObj.shippingAddress = orderParam.shippingAddress;
    newObj.subTotal = orderParam.subTotal;
    newObj.shippingPrice = orderParam.shippingPrice;
    newObj.total = orderParam.total;
    for (let i = 0; i < orderParam.orderItems.length; i++) {
      if (isNaN(orderParam.orderItems[i].quantity)) throw new Error('Casting error: quantity field is not a number!');
      if (typeof orderParam.orderItems[i].quantity === 'string') throw new Error('Casting error: quantity field is a string!');
      if (typeof orderParam.orderItems[i].productId !== 'string' ||
        orderParam.orderItems[i].productId.trim() === '') throw new Error('Some item has no valid product id!');
    }
    return newObj;
  };

};
