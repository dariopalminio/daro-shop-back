import {
  Controller, Get, Res, Post, Headers, Delete, Put, Body, Param, Query, Inject,
  HttpStatus, NotFoundException, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException, ConflictException, UseGuards
} from '@nestjs/common';
import { UserRegisterDataDTO } from 'src/domain/model/auth/register/user-register-data.dto.type';
import { IAuthService } from 'src/domain/service/interface/auth.service.interface';
import { StartConfirmEmailDataDTO } from 'src/domain/model/auth/register/start-confirm-email-data.dto';
import { StartRecoveryDataDTO } from 'src/domain/model/auth/recovery/start-recovery-data.dto.type';
import { VerificationCodeDataDTO } from 'src/domain/model/auth/register/verification-code-data.dto.type';
import { RecoveryUpdateDataDTO } from 'src/domain/model/auth/recovery/recovery-update-data.dto.type';
import { LogoutFormDTO } from 'src/domain/model/auth/login/logout-form.dto';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';

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
  @Roles('admin', 'manage-account')
  @Post('register')
  async register(@Res() res, @Body() userRegisterDTO: UserRegisterDataDTO): Promise<any> {
    console.log("register controller init");
    let result;
    try {
      console.log("Controller register-->userRegisterDTO:",userRegisterDTO);
      result = await this.authService.register(userRegisterDTO);
      console.log("register controller:", result);
    } catch (error) {
      switch (error.code) {
        case HttpStatus.UNAUTHORIZED:
          throw new UnauthorizedException(error.data);
        case HttpStatus.FORBIDDEN:
          throw new ForbiddenException(error.data);
        case HttpStatus.BAD_REQUEST:
          throw new BadRequestException(error);
        case HttpStatus.CONFLICT: {
          throw new ConflictException(error.data);
        }
        default:
          throw new InternalServerErrorException(error);
      }
    };
    return res.status(HttpStatus.OK).json(result);
  };

  @Post('register/confirm/start')
  async sendStartEmailConfirm(@Headers() headers, @Res() res, @Body() startConfirmEmailData: StartConfirmEmailDataDTO) {

    const result: any = await this.authService.sendStartEmailConfirm(startConfirmEmailData, this.getLang(headers));
    return res.status(result.status).json(result);
  };

  @Post('register/confirm')
  async confirmAccount(@Headers() headers, @Res() res, @Body() verificationCodeData: VerificationCodeDataDTO): Promise<any> {

    const confirmed: any = await this.authService.confirmAccount(verificationCodeData, this.getLang(headers));
    return res.status(HttpStatus.OK).json(confirmed);
  };

  @Post('logout')
  async logout(@Res() res, @Body() logoutFormDTO: LogoutFormDTO) {

    let authResponse: boolean;

    try {
      authResponse = await this.authService.logout(logoutFormDTO);
      if (authResponse === true)
        return res.status(HttpStatus.OK).json({});
    } catch (error) {
      if (error.code == 400) throw new BadRequestException(error);
      if (error.code == 401) throw new UnauthorizedException(error.data);
      throw new InternalServerErrorException(error);
    };
    throw new InternalServerErrorException();
  };

  @Post('recovery/start')
  async sendEmailToRecoveryPass(@Headers() headers, @Res() res, @Body() startRecoveryDataDTO: StartRecoveryDataDTO) {

    console.log("sendEmailToRecoveryPass getLang:", this.getLang(headers));
    console.log("sendEmailToRecoveryPass startRecoveryDataDTO:", startRecoveryDataDTO);

    const authResponse: any = await this.authService.sendEmailToRecoveryPass(startRecoveryDataDTO, this.getLang(headers));
    return res.status(authResponse.status).json(authResponse);

  };

  @Post('recovery/update')
  async recoveryUpdatePassword(@Headers() headers, @Res() res, @Body() recoveryUpdateDataDTO: RecoveryUpdateDataDTO) {
    const data: any = await this.authService.recoveryUpdatePassword(recoveryUpdateDataDTO, this.getLang(headers));
    return res.status(HttpStatus.OK).json(data);
  };

  private getLang(headers: any): string {
    if (headers && headers.lang) return headers.lang;
    return 'en';
  };

};
