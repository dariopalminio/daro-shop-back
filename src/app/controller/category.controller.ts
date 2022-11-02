import { Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus, NotFoundException, InternalServerErrorException, UseGuards, BadRequestException } from '@nestjs/common';
import { ICategoryService } from 'src/domain/incoming/category.service.interface';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { PaginatedResult } from 'src/domain/model/paginated-result';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { Category } from 'src/domain/model/category/category';
import { CategoryDTO } from '../dto/category.dto';
import { AppErrorHandler } from '../error/app-error-handler';

/**
 * Category controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('products/categories')
export class CategoryController {

  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService<Category>,
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
      message: "Hello World from category service " + this.globalConfig.get<string>('VERSION') + "!",
      name: "category",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };

  // Get Products /product/all
  // http://localhost:3001/api/webshop/v1/catalog/category/all?page=1&limit=2&orderBy=name&isAsc=true
  @Get('all')
  async getAll(@Res() res) {
    try {
      const list: Category[] = await this.categoryService.getAll();
      return res.status(HttpStatus.OK).json(list);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
  };

  // GET single Category: /product/5c9d46100e2e5c44c444b2d1
  @Get('/id/:categoryID')
  async getById(@Res() res, @Param('categoryID') categoryID) {
    let category: any;
    try {
      category = await this.categoryService.getById(categoryID);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!category) throw new NotFoundException('Category does not exist!');
    return res.status(HttpStatus.OK).json(category);
  };

  // Add Category: /category/create
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async createCategory(@Res() res, @Body() createCategoryDTO: CategoryDTO) {
    let newCat: Category;
    try {
      newCat = await this.categoryService.create(createCategoryDTO);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!newCat) throw new NotFoundException('Category does not exist or canot delete category!');
    return res.status(HttpStatus.OK).json({
      message: 'Category Created Successfully',
      category: newCat
    })
  };

  // Delete Category: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteCategory(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    let categoryDeleted: boolean;;
    try {
      categoryDeleted = await this.categoryService.delete(id);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
    if (!categoryDeleted) throw new NotFoundException('Category does not exist or canot delete category!');
    return res.status(HttpStatus.OK).json({
      message: 'Category Deleted Successfully',
      deleted: categoryDeleted
    })
  };

  // Update Category: /update?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Put('update')
  async updateCategory(@Res() res, @Body() categoryDTO: CategoryDTO, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    /*
    let category: Category;
    try {
      category = new Category(categoryDTO);
    } catch (error) {
      throw new BadRequestException('Category data malformed: ' + error.message);
    }
    */
    let updatedCategory: any;
    try {
      updatedCategory = await this.categoryService.updateById(id, categoryDTO);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    };
    if (!updatedCategory) throw new NotFoundException('Problem in creation. Category does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Category Updated Successfully',
      updated: updatedCategory
    })
  };

  // Example: http://localhost:3001/api/webshop/v1/categories/search?page=1&limit=100&orderBy=name&isAsc=true
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
      const data: PaginatedResult = await this.categoryService.search({}, page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw AppErrorHandler.createError(error);
    }
  };

};