import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { IOrderService } from 'src/domain/service/interface/order.service.interface';
import { IOrder } from 'src/domain/model/order-aggregate/order.interface';
import { Order } from 'src/domain/model/order-aggregate/order';
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
    let order: Order;
    try {
      order = new Order();
      order.setFromAny(orderToCreateDTO);
    } catch (error) {
      throw new BadRequestException('Order data malformed:' + error.message);
    }

    const objCreated = await this.orderService.create(order);
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
    let order: Order;
    try {
      order = new Order();
      order.setFromAny(orderToInitializeDTO);
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


};
