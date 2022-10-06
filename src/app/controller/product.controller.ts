import {
  Controller, Inject, Post, Res, HttpStatus, Body, Get, Param,
  NotFoundException, Delete, Query, Put, BadRequestException, InternalServerErrorException, UseGuards
} from '@nestjs/common';

import { IProductService } from 'src/domain/service/interface/product.service.interface';
import { Product } from 'src/domain/model/product/product';
import { IProduct } from 'src/domain/model/product/product.interface';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';

@Controller('products')
export class ProductController {

  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService<IProduct>,
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
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    };
  };

  // Example: http://localhost:3001/api/webshop/v1/products/catalog?category=Rubro&page=1&limit=100&orderBy=name&isAsc=true
  @Get('catalog')
  async getCatalog(@Res() res, @Query('page') pageParam, @Query('category') category, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
      if (pageParam && limitParam && orderBy && isAsc) {
        const page: number = parseInt(pageParam);
        const limit: number = parseInt(limitParam);
        const orderByField: string = orderBy.toString();
        const isAscending: boolean = (isAsc === 'true') ? true : false;
        const data: FilteredProductsDTO = await this.productService.getCatalog(category, page, limit, orderByField, isAscending);
        return res.status(HttpStatus.OK).json(data);
      } else {
        throw new InternalServerErrorException("No params");
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
  };


  // GET single http://localhost:3001/api/webshop/v1/products/id/632ded6d5a88c40e4fa634e9
  @Get('/id/:productID')
  async getProduct(@Res() res, @Param('productID') productID) {
    let product: any;
    try {
      product = await this.productService.getById(productID);
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!product) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json(product);
  };

  // GET single http://localhost:3001/api/webshop/v1/products/id/632ded6d5a88c40e4fa634e9
  @Get('/detail/id/:productID')
  async getDetailById(@Res() res, @Param('productID') productID) {
    let product: any;
    try {
      product = await this.productService.getDetailById(productID);
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!product) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json(product);
  };

  // Add Product: /product/create
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Post('create')
  async createProduct(@Res() res, @Body() createProductDTO: Product) {
    let productCreated: boolean;
    try {
      productCreated = await this.productService.create(createProductDTO);
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!productCreated) throw new NotFoundException('Product does not exist or canot delete!');
    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Created',
      created: productCreated
    });
  };

  // Delete Product: /delete?productID=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteProduct(@Res() res, @Query('id') productID) {
    let productDeleted: boolean;
    try {
      productDeleted = await this.productService.delete(productID);
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!productDeleted) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Product Deleted Successfully',
      deleted: productDeleted
    });
  };

  // Update Product: /update?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Put('update')
  async updateProduct(@Res() res, @Body() createProductDTO: Product, @Query('id') id) {
    let updatedProduct: boolean;
    try {
      updatedProduct = await this.productService.updateById(id, createProductDTO);
    } catch (error) {
      throw new InternalServerErrorException(error);
    };
    if (!updatedProduct) throw new NotFoundException('Product does not exist!');

    return res.status(HttpStatus.OK).json({
      message: 'Product Updated Successfully',
      updated: updatedProduct
    });
  };

  @Get('generate/sku')
  async generateSKU(@Res() res, @Query('type') typeParam, @Query('brand') brandParam, @Query('model') modelParam, @Query('color') colorParam, @Query('size') sizeParam) {
    try {
      const type: string = typeParam.toString();
      const brand: string = brandParam.toString();
      const model: string = modelParam.toString();
      const color: string = colorParam.toString();
      const size: string = sizeParam.toString();

      if (!type || !brand || !model || !color || !size)
        throw new BadRequestException("There are an empty attribute!")

      const skuNew = await this.productService.generateSKU(type, brand, model, color, size);
      return res.status(HttpStatus.OK).json({ "sku": skuNew });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  };

};
