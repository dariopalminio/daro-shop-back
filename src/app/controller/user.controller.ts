import {
  Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus,
  NotFoundException, UseGuards, InternalServerErrorException, BadRequestException
} from '@nestjs/common';
import { IUserService } from 'src/domain/service/interface/user.service.interface';
import { IUser } from 'src/domain/model/user/user.interface';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';

/**
 * Users controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('users')
export class UserController {

  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<IUser>,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }

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
    const user = await this.userService.getById(userID);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  //Example http://localhost:3001/api/webshop/v1/users/username/dariopalminio@gmail.com
  @Get('/user')
  async getByUserName(@Res() res, @Query('userName') userName) {
    const user = await this.userService.getByUserName(userName);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  // Add User: /user/create
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Post('create')
  async createUser(@Res() res, @Body() userRegisterDTO: IUser) {
    try {
      this.validateUser(userRegisterDTO);
    } catch (error) {
      throw new BadRequestException('User data malformed:' + error.message);
    }
    let createdId: IUser;
    try {
      createdId = await this.userService.create(userRegisterDTO);
    } catch (error) {
      new InternalServerErrorException(error);
    }
    if (!createdId) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Created Successfully',
      user: createdId
    });
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    const categoryDeleted = await this.userService.delete(id);
    if (!categoryDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Deleted Successfully',
      categoryDeleted
    });
  };

  // Update user: /update?id=5c9d45e705ea4843c8d0e8f7
  @Put('update')
  async updateUser(@Res() res, @Body() user: IUser, @Query('id') id) {
    if (!id) throw new BadRequestException('id not specified!');
    const updatedUser = await this.userService.updateById(id, user);
    if (!updatedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      updatedUser
    });
  };

/**
 * Validation of User
 * Note: Data should always be assumed to be bad until it’s been through some kind of validation process. 
 * In the future move this validation to a validatable object!
 */
  private validateUser(userRegisterDTO: IUser): boolean {
    if (!userRegisterDTO.userName || !userRegisterDTO.email || !userRegisterDTO.password
      || !userRegisterDTO.firstName || !userRegisterDTO.lastName || !userRegisterDTO.roles)
      throw new Error('Some field (userName, firstName, lastName, email, password) is missing!');
    const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const hasClientEmail: boolean = expresionsRegularEmail.test(userRegisterDTO.email);
    if (!hasClientEmail) throw new Error('Field email has invalid format!');
    return true;
  }
};
