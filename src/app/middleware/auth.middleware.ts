import { Injectable, NestMiddleware, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IAuthTokensService } from 'src/domain/incoming/auth.tokens.service.interface';
import { HeadersAuthorizationError, UnauthorizedJwtError } from '../error/app-auth-errors';
import extractTokenFromHeader from '../helper/token.helper';
import { IGlobalConfig } from "hexa-three-levels";

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
     * Auth Middleware (for OAuth 2.0 Authorization) is a function which is called before the route handler to validate JWT Token. 
     * Specific routes will be authorized and available only when the caller (usually a specific authenticated user) has an enabling token.
     * AuthGuard we will now build assumes an authenticated user (and therefore a token is attached to the request headers). 
     * It will extract and validate the token and use the extracted information to determine whether or not the request can proceed.
     * In initialization phase microservice loads public key and signing algorithm
     * from Auth server well known config page. On each request microservice checks 
     * the signature of the bearer token. Token validation is done offline without 
     * going to Auth server.
     */
    use(req: Request, res: Response, next: () => void) {
        console.log("AUTH_MIDDLEWARE_ON=", this.globalConfig.get<boolean>('AUTH_MIDDLEWARE_ON'));
        console.log("req.originalUrl:", req.originalUrl);

        const isAuthGuardActive: boolean = this.globalConfig.get<boolean>('AUTH_MIDDLEWARE_ON');

        if (isAuthGuardActive === true) {

            console.log("INTO MIDDLEWARE...", req.originalUrl);
            if (!req.headers || !req.headers.authorization) {
                //return res.status(400).json({ message: "Not authorized by the Auth Guard Middleware because no authorization data in Header." });
                throw new BadRequestException(new HeadersAuthorizationError('', {"method": req.method, "url": req.url}));
            }

            try {
                var token = extractTokenFromHeader(req.headers);
                const a = jwt.verify(token, this.authTokensService.getPEMPublicKey(), { algorithms: ['RS256'] });
            } catch (error) {
                const msg = `Not authorized by the Auth Guard Middleware because invalid token (${error.message})`;
                //return res.status(401).send({ message: msg }); // Unauthorized, invalid signature
                throw new UnauthorizedException(new UnauthorizedJwtError(msg, {"method": req.method, "url": req.url}));
            };
            
        }
        next();
    };


};