import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { IOrderService } from 'src/domain/incoming/order.service.interface';
import { Order } from 'src/domain/model/order-aggregate/order';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { OrderToInitializeDTO } from '../dto/order-to-initialize.dto';
import { OrderToCreateDTO } from '../dto/order-to-create.dto';
import { AppErrorHandler } from '../error/app-error-handler';

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
    private readonly orderService: IOrderService<Order>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }

  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
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
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async create(@Res() res, @Body() orderToCreateDTO: OrderToCreateDTO) {
    let orderToCreate: Order;
    try {
      orderToCreate = new Order(orderToCreateDTO);
    } catch (error) {
      throw new BadRequestException('Order data malformed: ' + error.message);
    }
    let objCreated: any;
    try {
      objCreated = await this.orderService.create(orderToCreate);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!objCreated) throw new NotFoundException('Could not be created!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Created Successfully',
      order: objCreated
    })
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    let objDeleted: any;
    try {
      objDeleted = await this.orderService.delete(id);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!objDeleted) throw new NotFoundException('Does not exist or canot be deleted!');
    return res.status(HttpStatus.OK).json({
      message: 'Order Deleted Successfully',
      deleted: objDeleted
    })
  };

  @Post('initialize')
  async initialize(@Res() res, @Body() orderToInitializeDTO: OrderToInitializeDTO) {
    let order: Order;
    try {
      order = new Order(orderToInitializeDTO);
    } catch (error) {
      throw new BadRequestException('Order data malformed: ' + error.message);
    }
    try {
      const orderCreated = await this.orderService.initialize(order);
      return res.status(HttpStatus.OK).json({
        message: 'Order Initialized Successfully',
        order: orderCreated
      })
    } catch (error) {
      throw AppErrorHandler.createError(error);
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
      })
    } catch (error) {
      throw AppErrorHandler.createError(error);
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
      })
    } catch (error) {
      throw AppErrorHandler.createError(error);
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
      })
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
  };


};
