import { Controller, Get, Res, Post, Delete, Put, Body, Param, Query, Inject, HttpStatus, NotFoundException, UseGuards, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { IProfileService } from 'src/domain/incoming/profile.service.interface';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { ProfileDTO } from '../dto/profile.dto';
import { Profile } from 'src/domain/model/profile/profile';
import { AppErrorHandler } from '../error/app-error-handler';

/**
 * Profile controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('profiles')
export class ProfileController {

  constructor(
    @Inject('IProfileService')
    private readonly profileService: IProfileService<Profile>,
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
      name: "profile",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };

  // Get Products /user/all
  @Get('all')
  async getAll(@Res() res, @Query('page') pageParam, @Query('limit') limitParam, @Query('orderBy') orderBy, @Query('isAsc') isAsc) {
    try {
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
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
  };


  @Get('/id/:userID')
  async getById(@Res() res, @Param('userID') userID) {
    if (!userID) throw new BadRequestException('Param userID not specified!');
    let user;
    try {
      user = await this.profileService.getById(userID);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!user) throw new NotFoundException('Profile does not exist!');
    return res.status(HttpStatus.OK).json(user);
  };

  //Example http://localhost:3001/api/webshop/v1/users/username/dariopalminio@gmail.com
  @Get('/profile')
  async getByUserName(@Res() res, @Query('userName') userName) {
    if (!userName) throw new BadRequestException('Param userName not specified!');
    try {
      const profile: Profile = await this.profileService.getByUserName(userName);
      if (!profile) throw new NotFoundException('Profile does not exist!');
      return res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
  };

  // Add User: /profiles/create
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('create')
  async create(@Res() res, @Body() profileDTO: ProfileDTO) {
    let newProfile: Profile;
    try {
      newProfile = await this.profileService.create(profileDTO);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!newProfile) throw new NotFoundException('Profile does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Profile Created Successfully',
      profile: newProfile
    });
  };

  // Delete user: /delete?id=5c9d45e705ea4843c8d0e8f7
  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Delete('delete')
  async delete(@Res() res, @Query('id') id) {
    if (!id) throw new BadRequestException('Param id not specified!');
    let categoryDeleted;
    try {
      categoryDeleted = await this.profileService.delete(id);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!categoryDeleted) throw new NotFoundException('Profile does not exist or canot delete user!');
    return res.status(HttpStatus.OK).json({
      message: 'Profile Deleted Successfully',
      categoryDeleted
    });
  };


  @Put('update')
  async update(@Res() res, @Body() profileDTO: ProfileDTO) {
    let profile: Profile;
    try {
      profile = new Profile(profileDTO);
    } catch (error) {
      throw new BadRequestException('Profile data malformed:' + error.message);
    }
    let updatedUser: any;
    try {
      updatedUser = await this.profileService.updateProfile(profile);
    } catch (error) {
      throw AppErrorHandler.createHttpException(error);
    }
    if (!updatedUser) throw new NotFoundException('Profile does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Profile Updated Successfully',
      updated: updatedUser
    });
  };

};
