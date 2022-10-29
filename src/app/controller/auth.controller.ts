import {
  Controller, Get, Res, Post, Headers, Delete, Put, Body, Param, Query, Inject,
  HttpStatus, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException, ConflictException, UseGuards, NotFoundException
} from '@nestjs/common';
import { IAuthService } from 'src/domain/incoming/auth.service.interface';
import { StartConfirmEmailData } from 'src/domain/model/auth/register/start-confirm-email-data';
import { StartRecoveryDataType } from 'src/domain/model/auth/recovery/start-recovery-data.type';
import { VerificationCodeDataType } from 'src/domain/model/auth/register/verification-code-data.type';
import { RecoveryUpdateDataType } from 'src/domain/model/auth/recovery/recovery-update-data.type';
import { LogoutForm } from 'src/domain/model/auth/login/logout-form';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { UserRegisterDTO } from '../dto/user-register.dto';
import { RegisterForm } from 'src/domain/model/auth/register/register-form';
import { VerificationCodeDTO } from '../dto/verification-code.dto';
import { StartConfirmEmailDTO } from '../dto/start-confirm-email.dto';
import { throwAppError } from '../error/app-error-handling';

/**
 * Auth controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('auth')
export class AuthController {

  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }

  @Get()
  getHello(@Res() res) {
    const response: HelloWorldDTO = {
      isSuccess: true,
      status: HttpStatus.OK,
      message: "Hello World from auth " + this.globalConfig.get<string>('VERSION') + "!",
      name: "auth",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };


  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('register')
  async register(@Res() res, @Body() userRegisterDTO: UserRegisterDTO): Promise<any> {
    const { userName, firstName, lastName, email, password } = userRegisterDTO;
    const registerForm: RegisterForm = new RegisterForm(userName, firstName, lastName, email, password);;
    console.log("register controller init");
    let result;
    try {
      console.log("Controller register-->userRegisterDTO:", registerForm);
      result = await this.authService.register(registerForm);
      console.log("register controller:", result);
    } catch (error) {
      throwAppError(error);
    };
    return res.status(HttpStatus.OK).json(result);
  };

  @Post('register/confirm/start')
  async sendStartEmailConfirm(@Headers() headers, @Res() res, @Body() startConfirmEmailData: StartConfirmEmailDTO) {
    try {
      const result: any = await this.authService.sendStartEmailConfirm(startConfirmEmailData, this.getLang(headers));
      return res.status(result.status).json(result);
    } catch (error) {
      throwAppError(error);
    }
  };

  @Post('register/confirm')
  async confirmAccount(@Headers() headers, @Res() res, @Body() verificationCodeDataDTO: VerificationCodeDTO): Promise<any> {
    let confirmed: any;
    try {
      confirmed = await this.authService.confirmAccount(verificationCodeDataDTO, this.getLang(headers));
      return res.status(HttpStatus.OK).json(confirmed);
    } catch (error) {
      throwAppError(error);
    }
  };

  @Post('logout')
  async logout(@Res() res, @Body() logoutFormDTO: LogoutForm) {
    let authResponse: boolean;
    try {
      authResponse = await this.authService.logout(logoutFormDTO);
      if (authResponse === true)
        return res.status(HttpStatus.OK).json({});
    } catch (error) {
      throwAppError(error);
    };
    throw new InternalServerErrorException();
  };

  @Post('recovery/start')
  async sendEmailToRecoveryPass(@Headers() headers, @Res() res, @Body() startRecoveryDataDTO: StartRecoveryDataType) {
    //console.log("sendEmailToRecoveryPass getLang:", this.getLang(headers));
    //console.log("sendEmailToRecoveryPass startRecoveryDataDTO:", startRecoveryDataDTO);
    let authResponse: any;
    try {
      authResponse = await this.authService.sendEmailToRecoveryPass(startRecoveryDataDTO, this.getLang(headers));
      return res.status(authResponse.status).json(authResponse);
    } catch (error) {
      throwAppError(error);
    }
  };

  @Post('recovery/update')
  async recoveryUpdatePassword(@Headers() headers, @Res() res, @Body() recoveryUpdateDataDTO: RecoveryUpdateDataType) {
    try {
      const data: any = await this.authService.recoveryUpdatePassword(recoveryUpdateDataDTO, this.getLang(headers));
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throwAppError(error);
    }
  };

  private getLang(headers: any): string {
    if (headers && headers.lang) return headers.lang;
    return 'en';
  };

};
