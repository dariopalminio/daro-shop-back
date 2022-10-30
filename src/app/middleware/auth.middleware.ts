import { Injectable, NestMiddleware, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IAuthTokensService } from 'src/domain/incoming/auth.tokens.service.interface';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { AppErrorHandler } from '../error/app-error-handler';
import { HeadersAuthorizationErrors, UnauthorizedJwtError } from '../error/app-auth-errors';
import extractTokenFromHeader from '../helper/token.helper';

/**
 * Auth Middleware
 * 
 * This Middleware is used to validate authentication through JWT attachment in header
 * 
 * Middleware is called only before the route handler is called. You have access to the response object, 
 * but you don't have the result of the route handler. They are basically express middleware functions.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        @Inject('IGlobalConfig')
        private readonly globalConfig: IGlobalConfig,
        @Inject('IAuthTokensService')
        private readonly authTokensService: IAuthTokensService,
    ) { };

    /**
     * Auth Middleware is a function which is called before the route handler to validate JWT Token. 
     * Specific routes will be authorized and available only when the caller (usually a specific authenticated user) has an enabling token.
     * AuthGuard we will now build assumes an authenticated user (and therefore a token is attached to the request headers). 
     * It will extract and validate the token and use the extracted information to determine whether or not the request can proceed.
     * In initialization phase microservice loads public key and signing algorithm
     * from Auth server (Keycloak’s) well known config page. On each request microservice checks 
     * the signature of the bearer token. Token validation is done offline without 
     * going to Auth server (Keycloak).
     */
    use(req: Request, res: Response, next: () => void) {
        console.log("AUTH_MIDDLEWARE_ON=", this.globalConfig.get<boolean>('AUTH_MIDDLEWARE_ON'));
        console.log("req.originalUrl:", req.originalUrl);

        const isAuthGuardActive: boolean = this.globalConfig.get<boolean>('AUTH_MIDDLEWARE_ON');

        if (isAuthGuardActive === false) {
            next(); //does nothing
        }

        if (!req.headers || !req.headers.authorization) {
            //return res.status(400).json({ message: "Not authorized by the Auth Guard Middleware because no authorization data in Header." });
            const e = new HeadersAuthorizationErrors();
            throw new BadRequestException(new HeadersAuthorizationErrors());
        }

        try {
            var token = extractTokenFromHeader(req.headers);
            const a = jwt.verify(token, this.authTokensService.getPEMPublicKey(), { algorithms: ['RS256'] });
        } catch (error) {
            const msg = `Not authorized by the Auth Guard Middleware because invalid token (${error.message})`;
            //return res.status(401).send({ message: msg }); // Unauthorized, invalid signature
            throw new UnauthorizedException(new UnauthorizedJwtError(msg));
        };

        next();
    };


};