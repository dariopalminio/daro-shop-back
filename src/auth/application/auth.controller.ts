import {
  Controller, Get, Res, Post, Headers, Body, Inject,
  HttpStatus, InternalServerErrorException, UseGuards, HttpException
} from '@nestjs/common';
import { IAuthService } from 'src/auth/domain/auth.service.interface';
import { StartRecoveryDataType } from 'src/auth/domain/model/recovery/start-recovery-data.type';
import { RecoveryUpdateDataType } from 'src/auth/domain/model/recovery/recovery-update-data.type';
import { LogoutForm } from 'src/auth/domain/model/login/logout-form';
import { HelloWorldDTO } from '../../common/application/hello-world.dto';
import { RolesGuard } from '../../common/application/auth-guard/roles.guard';
import { Roles } from '../../common/application/auth-guard/roles.decorator';
import { RolesEnum } from 'src/auth/domain/model/reles.enum';
import { UserRegisterDTO } from './user-register.dto';
import { RegisterForm } from 'src/auth/domain/model/register/register-form';
import { VerificationCodeDTO } from './verification-code.dto';
import { StartConfirmEmailDTO } from './start-confirm-email.dto';
import { IAppErrorHandler, IGlobalConfig } from "hexa-three-levels";
import { AppNestErrorHandler } from '../../common/application/app-error-handler';

/**
 * Auth controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('auth')
export class AuthController {

  appErrorHandler: IAppErrorHandler<HttpException>;

  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
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
    const { username, firstName, lastName, email, password } = userRegisterDTO;
    const registerForm: RegisterForm = new RegisterForm(username, firstName, lastName, email, password);;
    console.log("register controller init");
    let result;
    try {
      console.log("Controller register-->userRegisterDTO:", registerForm);
      result = await this.authService.register(registerForm);
      console.log("register controller:", result);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    };
    return res.status(HttpStatus.OK).json(result);
  };

  @Post('register/confirm/start')
  async sendStartEmailConfirm(@Headers() headers, @Res() res, @Body() startConfirmEmailData: StartConfirmEmailDTO) {
    try {
      const result: any = await this.authService.sendStartEmailConfirm(startConfirmEmailData, this.getLang(headers));
      return res.status(result.status).json(result);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
  };

  @Post('register/confirm')
  async confirmAccount(@Headers() headers, @Res() res, @Body() verificationCodeDataDTO: VerificationCodeDTO): Promise<any> {
    let confirmed: any;
    try {
      confirmed = await this.authService.confirmAccount(verificationCodeDataDTO, this.getLang(headers));
      return res.status(HttpStatus.OK).json(confirmed);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
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
      throw this.appErrorHandler.createHttpException(error);
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
      throw this.appErrorHandler.createHttpException(error);
    }
  };

  @Post('recovery/update')
  async recoveryUpdatePassword(@Headers() headers, @Res() res, @Body() recoveryUpdateDataDTO: RecoveryUpdateDataType) {
    try {
      const data: any = await this.authService.recoveryUpdatePassword(recoveryUpdateDataDTO, this.getLang(headers));
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw this.appErrorHandler.createHttpException(error);
    }
  };

  private getLang(headers: any): string {
    if (headers && headers.lang) return headers.lang;
    return 'en';
  };

};
