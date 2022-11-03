import { Controller, Get, Res, Inject, Query, BadRequestException, HttpStatus, UseGuards, Post, Body, NotFoundException, Delete, Put, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { Address } from 'src/domain/model/profile/address';
import { IShippingPriceService } from 'src/domain/incoming/shipping-price.service.interface';
import { Roles } from '../guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { ShippingPriceDTO } from '../dto/shipping-price.dto';
import { AppErrorHandler } from '../error/app-error-handler';

/**
 * ShippingPrice controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('shipping/price')
export class ShippingPriceController {

  constructor(
    @Inject('IShippingPriceService')
    private readonly shippingPriceService: IShippingPriceService<ShippingPrice>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }

  @Get('address')
  async getPriceByAddress(@Res() res, @Query('country') countryParam, @Query('state') stateParam, @Query('neighborhood') neighborhoodParam, @Query('city') cityParam) {
    let addrs: Address;
    try {
      addrs = new Address(countryParam.toString(), stateParam.toString(), cityParam.toString(), neighborhoodParam.toString(), '', '');
      addrs.validateCountry();
      addrs.validateState();
      addrs.validateNeighborhood();
    } catch (error) {
      throw new BadRequestException('Missing some parameter!');
    }
    let pricingObj: any;
    try {
      pricingObj = await this.shippingPriceService.getPriceByAddress(addrs);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (pricingObj === null) throw new NotFoundException('Location not found');
    return res.status(200).json(pricingObj);
  };

  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
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
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async createShippingPrice(@Res() res, @Body() shippingPriceDTO: ShippingPriceDTO) {
    let objCreatedId: ShippingPrice;
    try {
      objCreatedId = await this.shippingPriceService.create(shippingPriceDTO);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!objCreatedId) throw new NotFoundException('Problems saving!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Created Successfully',
      shippingPrice: objCreatedId
    })
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    let objDeleted;
    try {
      objDeleted = await this.shippingPriceService.delete(id);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!objDeleted) throw new NotFoundException('Problem in creation!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Deleted Successfully',
      objDeleted
    })
  };


  @Put('update')
  async update(@Res() res, @Body() shippingPriceDTO: ShippingPriceDTO) {
    let shippingPrice: ShippingPrice;
    try {
      shippingPrice = new ShippingPrice(ShippingPriceDTO);
    } catch (error) {
      throw new BadRequestException('ShippingPrice data malformed:' + error.message);
    }
    const query = { location: shippingPriceDTO.location };
    let updatedObj: any;
    try {
      updatedObj = await this.shippingPriceService.update(query, shippingPrice);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!updatedObj) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Shipping Price Updated Successfully',
      updated: updatedObj
    })
  };


};
