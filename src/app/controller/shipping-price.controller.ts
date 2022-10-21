import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { Address } from 'src/domain/model/profile/address';
import { IShippingPriceService } from 'src/domain/service/interface/shipping-price.service.interface';
import { IShippingPrice } from 'src/domain/model/shipping/shipping-price.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';

@Controller('shipping/price')
export class ShippingPriceController {

  constructor(
    @Inject('IShippingPriceService')
    private readonly shippingPriceService: IShippingPriceService<IShippingPrice>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }


  @Get('address')
  async getPriceByAddress(@Res() res, @Query('country') countryParam, @Query('state') stateParam, @Query('neighborhood') neighborhoodParam, @Query('city') cityParam) {
    let addrs: Address;
    try {
      addrs = this.buildAndValidateAddress(countryParam.toString(), stateParam.toString(), cityParam.toString(), neighborhoodParam.toString());
    } catch (error) {
      throw new BadRequestException('Missing some parameter!');
    }
    let pricingObj: any;
    try {
       pricingObj = await this.shippingPriceService.getPriceByAddress(addrs);
    } catch (error) {
      new InternalServerErrorException(error);
    }
    if (pricingObj === null) throw new NotFoundException('Location not found');
    return res.status(200).json(pricingObj);
  };

  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    if (pageParam && limitParam && orderBy && isAsc) {
      const page: number = parseInt(pageParam);
      const limit: number = parseInt(limitParam);
      const orderByField: string = orderBy.toString();
      const isAscending: boolean = (isAsc === 'true') ? true : false;
      const list = await this.shippingPriceService.getAll(page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(list);
    } else {
      const list = await this.shippingPriceService.getAll();
      return res.status(HttpStatus.OK).json(list);
    }
  };

  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Post('create')
  async createShippingPrice(@Res() res, @Body() shippingPriceDTO: IShippingPrice) {
    console.log("create-->shippingPriceDTO:", shippingPriceDTO);
    let objCreatedId: IShippingPrice;
    try {
      objCreatedId = await this.shippingPriceService.create(shippingPriceDTO);
    } catch (error) {
      new InternalServerErrorException(error);
    }
    if (!objCreatedId) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Created Successfully',
      shippingPrice: objCreatedId
    });
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    const objDeleted = await this.shippingPriceService.delete(id);
    if (!objDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Deleted Successfully',
      objDeleted
    });
  };


  @Put('update')
  async updateProfile(@Res() res, @Body() shippingPriceDTO: IShippingPrice) {
    const query = { location: shippingPriceDTO.location };
    const updatedObj = await this.shippingPriceService.update(query, shippingPriceDTO);
    if (!updatedObj) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Updated Successfully',
      updatedObj
    });
  };

  private buildAndValidateAddress(countryParam: string, stateParam: string, cityParam: string, neighborhoodParam: string): Address {
    if (!countryParam || !stateParam || !neighborhoodParam || !cityParam) throw new Error('Missing some parameter!');
    const addrs: Address = new Address(countryParam, stateParam, cityParam, neighborhoodParam);
    return addrs;
  };

};
