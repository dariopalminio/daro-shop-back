import {
  Controller, Inject, Post, Res, HttpStatus, Body, Get, Param,
  NotFoundException, Delete, Query, Put, BadRequestException, InternalServerErrorException, UseGuards
} from '@nestjs/common';

import { IProductService } from 'src/domain/incoming/product.service.interface';
import { Product } from 'src/domain/model/product/product';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { PaginatedResult } from 'src/domain/model/paginated-result';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { ProductDTO } from '../dto/product.dto';
import { AppErrorHandler } from '../error/app-error-handler';

/**
 * Product controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('products')
export class ProductController {

  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService<Product>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }


  @ApiOperation({
    summary:
      'Hello world is get method to do Ping and test this service.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Succefully Ping',
    type: HelloWorldDTO,
  })
  @Get()
  getHello(@Res() res) {
    const response: HelloWorldDTO = {
      isSuccess: true,
      status: HttpStatus.OK,
      message: "Hello World from product service " + this.globalConfig.get<string>('VERSION') + "!",
      name: "product",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };


  // Get Products /product/all
  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
      if (pageParam && limitParam && orderBy && isAsc) {
        const page: number = parseInt(pageParam);
        const limit: number = parseInt(limitParam);
        const orderByField: string = orderBy.toString();
        const isAscending: boolean = (isAsc === 'true') ? true : false;
        const list = await this.productService.getAll(page, limit, orderByField, isAscending);
        return res.status(HttpStatus.OK).json(list);
      } else {
        const list = await this.productService.getAll();
        return res.status(HttpStatus.OK).json(list);
      }
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
  };

  // Get Products /product/actives/all
  @Get('actives/all')
  async getAllActives(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
      if (pageParam && limitParam && orderBy && isAsc) {
        const page: number = parseInt(pageParam);
        const limit: number = parseInt(limitParam);
        const orderByField: string = orderBy.toString();
        const isAscending: boolean = (isAsc === 'true') ? true : false;
        const list = await this.productService.getAllActives(page, limit, orderByField, isAscending);
        return res.status(HttpStatus.OK).json(list);
      } else {
        const list = await this.productService.getAll();
        return res.status(HttpStatus.OK).json(list);
      }
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
  };

  // getCatalog example: http://localhost:3001/api/webshop/v1/products/catalog?category=Rubro&page=1&limit=100&orderBy=name&isAsc=true
  @Get('catalog')
  async getCatalog(@Res() res, @Query('page') pageParam, @Query('category') category, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    let page: number, limit: number, orderByField: string, isAscending: boolean;
    try {
      if (!pageParam && !limitParam && !orderBy && !isAsc && !category)
        throw new Error("No params category, page, limit, orderBy or isAsc");
      page = parseInt(pageParam);
      limit = parseInt(limitParam);
      orderByField = orderBy.toString();
      isAscending = (isAsc === 'true') ? true : false;
    } catch (error) {
      throw new BadRequestException('Some parameter is wrong:' + error);
    }
    try {
      const data: PaginatedResult = await this.productService.getCatalog(category, page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
  };


  // getProductById example http://localhost:3001/api/webshop/v1/products/id/632ded6d5a88c40e4fa634e9
  @Get('/id/:productID')
  async getProductById(@Res() res, @Param('productID') productID) {
    if (!productID) throw new BadRequestException('Param productID not specified!');
    let product: any;
    try {
      product = await this.productService.getById(productID);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
    if (!product) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json(product);
  };

  // getDetailById example single http://localhost:3001/api/webshop/v1/products/id/632ded6d5a88c40e4fa634e9
  @Get('/detail/id/:productID')
  async getDetailById(@Res() res, @Param('productID') productID) {
    if (!productID) throw new BadRequestException('Param productID not specified!');
    let product: any;
    try {
      product = await this.productService.getDetailById(productID);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
    if (!product) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json(product);
  };

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async create(@Res() res, @Body() productToCreateDTO: ProductDTO) {
    let productCreatedId: Product;
    try {
      productCreatedId = await this.productService.create(productToCreateDTO);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!productCreatedId) throw new NotFoundException('Product does not exist or canot delete!');
    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Created',
      product: productCreatedId
    });
  };

  // Delete Product example: /delete?productID=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async delete(@Res() res, @Query('id') productID) {
    if (!productID) throw new BadRequestException('Param productID not specified!');
    let productDeleted: boolean;
    try {
      productDeleted = await this.productService.delete(productID);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
    if (!productDeleted) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Product Deleted Successfully',
      deleted: productDeleted
    });
  };

  // Update Product example: /update?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Put('update')
  async update(@Res() res, @Body() productDTO: ProductDTO, @Query('id') id) {
    if (!id) {
      throw new BadRequestException('Param id not specified!');
    }
    let updatedProduct: boolean;
    try {
      updatedProduct = await this.productService.updateById(id, productDTO);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
    if (!updatedProduct) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Product Updated Successfully',
      updated: updatedProduct
    });
  };

  @Get('generate/sku')
  async generateSKU(@Res() res, @Query('type') typeParam, @Query('brand') brandParam, @Query('model') modelParam, @Query('color') colorParam, @Query('size') sizeParam) {
    if (!typeParam) throw new BadRequestException("There is type empty attribute!")
    if (!brandParam) throw new BadRequestException("There is brand empty attribute!")
    if (!modelParam) throw new BadRequestException("There is model empty attribute!")
    if (!colorParam) throw new BadRequestException("There is color empty attribute!")
    if (!sizeParam) throw new BadRequestException("There is size empty attribute!")
    try {
      const type: string = typeParam.toString();
      const brand: string = brandParam.toString();
      const model: string = modelParam.toString();
      const color: string = colorParam.toString();
      const size: string = sizeParam.toString();
      const skuNew = await this.productService.generateSKU(type, brand, model, color, size);
      return res.status(HttpStatus.OK).json({ "sku": skuNew });
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
  };


};
