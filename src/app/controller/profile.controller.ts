import { Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus, NotFoundException, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { IProfile } from 'src/domain/model/profile/profile.interface';
import { IProfileService } from 'src/domain/service/interface/profile.service.interface';

@Controller('profiles')
export class ProfileController {

  constructor(
    @Inject('IProfileService')
    private readonly profileService: IProfileService<IProfile>,
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
      const list = await this.profileService.getAll(page, limit, orderByField, isAscending);
      return res.status(HttpStatus.OK).json(list);
    } else {
      const list = await this.profileService.getAll();
      return res.status(HttpStatus.OK).json(list);
    }
  };


  @Get('/id/:userID')
  async getById(@Res() res, @Param('userID') userID) {
    const user = await this.profileService.getById(userID);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  //Example http://localhost:3001/api/webshop/v1/users/username/dariopalminio@gmail.com
  @Get('/profile')
  async getByUserName(@Res() res, @Query('userName') userName) {
    const user = await this.profileService.getByUserName(userName);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  // Add User: /profiles/create
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Post('create')
  async createUser(@Res() res, @Body() userRegisterDTO: UserProfileDTO) {
    let newId: string;
    try {
      newId = await this.profileService.create(userRegisterDTO);
    } catch (error) {
      new InternalServerErrorException(error);
    }
    if (!newId) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Created Successfully',
      id: newId
    });
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async deleteUser(@Res() res, @Query('id') id) {
    const categoryDeleted = await this.profileService.delete(id);
    if (!categoryDeleted) throw new NotFoundException('User does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'User Deleted Successfully',
      categoryDeleted
    });
  };


  @Put('update')
  async updateProfile(@Res() res, @Body() userProfileDTO: UserProfileDTO) {
    const updatedUser = await this.profileService.updateProfile(userProfileDTO);
    if (!updatedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      updatedUser
    });
  };



};
