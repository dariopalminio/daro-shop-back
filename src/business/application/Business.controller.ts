
import { Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus, NotFoundException, InternalServerErrorException, UseGuards, BadRequestException, HttpException } from '@nestjs/common';
import { IAppErrorHandler, PaginatedResult } from "hexa-three-levels";
import { IBusinessService } from './../domain/Business.service.interface';
import { BusinessDTO } from './Business.dto';
import { Business } from './../domain/Business.entity';
import { AppNestErrorHandler } from 'src/common/application/app-error-handler';

@Controller('business')
export class BusinessController {

  appErrorHandler: IAppErrorHandler<HttpException>;

  constructor(
    @Inject('IBusinessService')
    private readonly service: IBusinessService<Business>
  ) {
    this.appErrorHandler = new AppNestErrorHandler();
  }

  @Get('all')
  async getAll(@Res() res) {
    try {
      const list: Business[] = await this.service.getAll();
      return res.status(HttpStatus.OK).json(list);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    };
  };

  @Get('/id/:id')
  async getById(@Res() res, @Param('id') id) {
    let entity: any;
    try {
      entity = await this.service.getById(id);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!entity) throw new NotFoundException('Entity does not exist!');
    return res.status(HttpStatus.OK).json(entity);
  };

  @Get('search')
  async search(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    if (!pageParam || !limitParam || !orderBy || !isAsc) {
      throw new BadRequestException("some parameter is missing: page, limit, orderBy or isAsc");
    }
    try {
      const page: number = parseInt(pageParam);
      const limit: number = parseInt(limitParam);
      const orderByField: string = orderBy.toString();
      const isAscending: boolean = (isAsc === 'true') ? true : false;
      const data: PaginatedResult<any> = await this.service.search({}, page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
  };

  @Post('create')
  async create(@Res() res, @Body() dto: BusinessDTO) {
    let newEntity: Business;
    try {
      newEntity = await this.service.create(dto);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!newEntity) throw new NotFoundException('Business does not exist or canot delete category!');
    return res.status(HttpStatus.OK).json({
      message: 'Business Created Successfully',
      entity: newEntity
    })
  };

  @Delete('delete')
  async delete(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    let deleted: boolean;;
    try {
      deleted = await this.service.delete(id);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!deleted) throw new NotFoundException('Business does not exist or canot delete category!');
    return res.status(HttpStatus.OK).json({
      message: 'Business Deleted Successfully',
      deleted: deleted
    })
  };

  @Put('update')
  async update(@Res() res, @Body() dto: BusinessDTO, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    let updated: any;
    try {
      updated = await this.service.updateById(id, dto);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    };
    if (!updated) throw new NotFoundException('Problem in creation. Business does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Business Updated Successfully',
      updated: updated
    })
  };

};
