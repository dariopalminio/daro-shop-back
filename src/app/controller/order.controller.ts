import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { IOrderService } from 'src/domain/service/interface/order.service.interface';
import { IOrder } from 'src/domain/model/order/order.interface';

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
  @Roles('admin', 'manage-account')
  @Post('create')
  async createShippingPrice(@Res() res, @Body() orderDTO: IOrder) {
    console.log("create-->shippingPriceDTO:", orderDTO);
    const objCreated = await this.orderService.create(orderDTO);
    if (!objCreated) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Created Successfully',
      objCreated
    });
  };

  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    const objDeleted = await this.orderService.delete(id);
    if (!objDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Deleted Successfully',
      objDeleted
    });
  };

};
