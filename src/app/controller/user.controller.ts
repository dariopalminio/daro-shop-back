import {
  Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus,
  NotFoundException, UseGuards, InternalServerErrorException, BadRequestException, HttpException
} from '@nestjs/common';
import { IUserService } from 'src/domain/incoming/user.service.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { UserDTO } from '../dto/user.dto';
import { User } from 'src/domain/model/user/user';
import { IAppErrorHandler, IGlobalConfig } from "hexa-three-levels";
import { AppNestErrorHandler } from '../error/app-error-handler';

/**
 * Users controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('users')
export class UserController {

  appErrorHandler: IAppErrorHandler<HttpException>;
  
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<User>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { 
    this.appErrorHandler = new AppNestErrorHandler();
  }

  @Get()
  getHello(@Res() res) {
    const response: HelloWorldDTO = {
      isSuccess: true,
      status: HttpStatus.OK,
      message: "Hello World from product user " + this.globalConfig.get<string>('VERSION') + "!",
      name: "user",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };

  // Get Products /user/all
  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    if (pageParam && limitParam && orderBy && isAsc) {
      const page: number = parseInt(pageParam);
      const limit: number = parseInt(limitParam);
      const orderByField: string = orderBy.toString();
      const isAscending: boolean = (isAsc === 'true') ? true : false;
      const list = await this.userService.getAll(page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(list);
    } else {
      const list = await this.userService.getAll();
      return res.status(HttpStatus.OK).json(list);
    }
  };


  @Get('/id/:userID')
  async getById(@Res() res, @Param('userID') userID) {
    if (!userID) throw new BadRequestException('userID not specified!');
    let user;
    try {
       user = await this.userService.getById(userID);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  //Example http://localhost:3001/api/webshop/v1/users/username/dariopalminio@gmail.com
  @Get('/user')
  async getByUserName(@Res() res, @Query('userName') userName) {
    if (!userName) throw new BadRequestException('userName not specified!');
    let user;
    try {
       user = await this.userService.getByUserName(userName);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  // Add User: /user/create
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async createUser(@Res() res, @Body() userToCreateDTO: UserDTO) {
    let created: User;
    try {
       created = await this.userService.create(userToCreateDTO);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!created) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Created Successfully',
      user: created
    })
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    let categoryDeleted: any;
    try {
       categoryDeleted = await this.userService.delete(id);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!categoryDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Deleted Successfully',
      categoryDeleted
    })
  };

  // Update user: /update?id=5c9d45e705ea4843c8d0e8f7
  @Put('update')
  async updateUser(@Res() res, @Body() userDTO: UserDTO, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    let updatedUser: any;
    try {
       updatedUser = await this.userService.updateById(id, userDTO);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
    if (!updatedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      updated: updatedUser
    })
  };

};
