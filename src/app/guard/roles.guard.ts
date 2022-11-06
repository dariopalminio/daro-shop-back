import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import extractTokenFromHeader from '../helper/token.helper';
import { IGlobalConfig } from "hexa-three-levels";

/**
 * Roles Guards 
 * 
 * Global guards works as a middleware and are used across the whole application, for every controller and every route handler.
 * This RolesGuard is used to validate authorization through of roles decorator and using JWT attachment in header.
 * RolesGuard determine whether a given request will be handled by the route handler or not, 
 * depending on permissions by roles indicated in routes of controllers (controller-scoped).
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        @Inject('IGlobalConfig')
        private readonly globalConfig: IGlobalConfig) { }

    /**
     * This CanActivate function should return a boolean, indicating whether the current request is allowed or not. 
     * It can return the response either synchronously or asynchronously (via a Promise or Observable). 
     * Nest uses the return value to control the next action:
     * if it returns true, the request will be processed.
     * if it returns false, Nest will deny the request.
     */
    canActivate(context: ExecutionContext): boolean {
        console.log("RolesGuard executed!");

        if (!this.globalConfig.get<boolean>('AUTH_MIDDLEWARE_ON')) return true; //does nothing

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true; //does nothing
        }

        const request = context.switchToHttp().getRequest();
        //const response = context.switchToHttp().getResponse();
        console.log("RolesGuard for:", request.originalUrl);
        console.log("Roles from controller:", requiredRoles);
        const userRoles = this.obtainRolesFromJWT(request);
        const authorized = this.matchRoles(requiredRoles, userRoles);
        console.log("RolesGuard is this authorized?:", authorized);
        return authorized;
    }

    /**
     * Get the list of roles from the request header JWT data
     */
    obtainRolesFromJWT(request: any): Array<string> {
        try {
            console.log("obtainRolesFromKeycloakJWT process...");
            const token = extractTokenFromHeader(request.headers);
            const jwtDecoded = jwt.decode(token);
            console.log("RolesGuard.request.toke decoded:", jwtDecoded);

            let roles = [];

            if (jwtDecoded.roles) {
                if (jwtDecoded.roles instanceof Array)
                    roles = jwtDecoded.roles;
            }

            console.log("RolesGuard.request.toke roles:", roles);

            return roles;
        } catch (e) {
            console.log("RolesGuard exception:", e);
            return [];
        }
    };

    /**
     * Validates if the user has any of the required roles
     */
    matchRoles(requiredRoles: Array<string>, userRoles: Array<string>): boolean {
        let isMatch = userRoles.some(r => requiredRoles.indexOf(r) >= 0);
        return isMatch;
    };

}
