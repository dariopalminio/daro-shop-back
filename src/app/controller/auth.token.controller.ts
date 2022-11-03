import {
    Controller, Get, Res, Post, Headers, Delete, Put, Body, Param, Query, Inject,
    HttpStatus, NotFoundException, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException, ConflictException, UseGuards
} from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { AuthClientType } from 'src/domain/model/auth/token/auth.client.type';
import { RequestRefreshTokenType } from 'src/domain/model/auth/token/auth.request.refresh.token.type';
import { IAuthTokensService } from 'src/domain/incoming/auth.tokens.service.interface';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.type';
import { UserLoginDTO } from '../dto/user-login.dto';
import { LoginForm } from 'src/domain/model/auth/login/login-form';
import { AppErrorHandler } from '../error/app-error-handler';

/**
 * Auth Tokens controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('auth/tokens')
export class AuthTokensController {

    constructor(
        @Inject('IAuthTokensService')
        private readonly authTokensService: IAuthTokensService,
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
            message: "Hello World from auth " + this.globalConfig.get<string>('VERSION') + "!",
            name: "auth",
            version: this.globalConfig.get<string>('VERSION'),
            date: new Date()
        }
        return res.status(200).json(response);
    };

    /**
     * POST[UAT] Login to obtain access token for a user 
     */
    @Post('login')
    async login(@Res() res, @Body() userLoginDTO: UserLoginDTO) {
        const { userName, password } = userLoginDTO;
        const loginForm: LoginForm = new LoginForm(userName, password);
        let authResponse: any;
        try {
            authResponse = await this.authTokensService.login(loginForm);
        } catch (error) {
            throw AppErrorHandler.createHttpException(error);
        }

        if (!authResponse.access_token) return res.status(HttpStatus.UNAUTHORIZED).json(authResponse);

        return res.status(HttpStatus.OK).json(authResponse);
    };


    /**
     * POST[SAT] Obtain app accsess token from a service account
     */
    @Post('app')
    async getAppToken(@Headers() headers, @Res() res, @Body() authClientDTO: AuthClientType) {
        let authResponse: any;
        console.log('authClientDTO:', authClientDTO);
        try {
            authResponse = await this.authTokensService.getAppToken(authClientDTO);
        } catch (error) {
            throw AppErrorHandler.createHttpException(error);
          }
        return res.status(HttpStatus.OK).json(authResponse);
    };

    /**
     * POST[SAT] Get a admin access token (from auth server) for next time can create user or update user.
     */
    @Post('admin')
    async getAdminToken(@Headers() headers, @Res() res, @Body() body: NewAdminTokenRequestType) {
        let data: any;
        try {
            data = await this.authTokensService.getAdminToken(body);
        } catch (error) {
            throw AppErrorHandler.createHttpException(error);
          }
        return res.status(HttpStatus.OK).json(data);
    };

    /**
       * POST[SAT] Get Refresh Token
       * 
       * getRefreshTokenService is used when you need to make the user keep login in the system 
       * if the user's access_token get expired and user want to keep login. How can I get newly 
       * updated access_token with this function.
       * Use Refresh Tokens
     */
    @Post('refresh')
    async getRefreshToken(@Headers() headers, @Res() res, @Body() body: RequestRefreshTokenType) {
        let authResponse: any;
        try {
            authResponse = await this.authTokensService.getRefreshToken(body);
        } catch (error) {
            throw AppErrorHandler.createHttpException(error);
          }
        return res.status(HttpStatus.OK).json(authResponse);
    };

};