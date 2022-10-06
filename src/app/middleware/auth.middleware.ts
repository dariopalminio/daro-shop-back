import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import extractTokenFromHeader from '../helper/token.helper';

/**
 * Middleware is called only before the route handler is called. You have access to the response object, 
 * but you don't have the result of the route handler. They are basically express middleware functions.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        @Inject('IGlobalConfig')
        private readonly globalConfig: IGlobalConfig,
    ) { };

    /**
     * In initialization phase microservice loads public key and signing algorithm
     * from Auth server (Keycloak’s) well known config page. On each request microservice checks 
     * the signature of the bearer token. Token validation is done offline without 
     * going to Auth server (Keycloak).
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    use(req: Request, res: Response, next: () => void) {
        console.log("AUTH_MIDDLEWARE_ON=", this.globalConfig.get<string>('AUTH_MIDDLEWARE_ON'));
        console.log("req.originalUrl:", req.originalUrl);

        if (this.globalConfig.get<string>('AUTH_MIDDLEWARE_ON')) {

            if (!req.headers || !req.headers.authorization) {
                console.log("????????????????????????" );
                console.log("401 Unauthorized! No authorization data in Header." );
                return res.status(401).json({ message: "Unauthorized! No authorization data in Header." });
            }

            try {
                var token = extractTokenFromHeader(req.headers);
                console.log("AuthMiddleware.token:", token);

                jwt.verify(token, this.getPEMPublicKey(), { algorithms: ['RS256'] });
                console.log("OKKKKKKKKKKKKKKKKKKKKKKKKKKKK!" );
            } catch (error) {
                // Unauthorized, invalid signature
                console.log("????????????????????????" );
                console.log("401 Invalid token." );
                return res.status(401).send({ message: error.message });
            };
        };

        next();
    };

    /**
     * Create the PEM string base64 decode with auth public key
     * @returns 
     */
    private getPEMPublicKey(): string {
        const publicKey: string = this.globalConfig.get<string>('AUTH_PUBLIC_KEY');
        if (!publicKey || publicKey === '')
            throw Error("The public key is wrong!");
        let pem = '';
        pem += '-----BEGIN PUBLIC KEY-----\n';
        pem += this.globalConfig.get<string>('AUTH_PUBLIC_KEY');
        pem += '\n';
        pem += '-----END PUBLIC KEY-----\n';
        return pem;
    };


};