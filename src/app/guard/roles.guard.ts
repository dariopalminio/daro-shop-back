import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { IGlobalConfig } from 'src/domain/infra-interface/global-config.interface';
import extractTokenFromHeader from '../helper/token.helper';

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

    canActivate(context: ExecutionContext): boolean {
        console.log("RolesGuard executed!");
        if (!this.globalConfig.get<string>('AUTH_MIDDLEWARE_ON')) return true;
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        return true;/*
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        console.log("RolesGuard for:", request.originalUrl);
        console.log("Roles from controller:", requiredRoles);
        const userRoles = this.obtainRolesFromKeycloakJWT(request);
        const authorized = this.matchRoles(requiredRoles, userRoles);
        console.log("RolesGuard is this authorized?:", authorized);
        return authorized;*/
    }

    matchRoles(requiredRoles: Array<string>, userRoles: Array<string>): boolean {
        let isMatch = userRoles.some(r => requiredRoles.indexOf(r) >= 0);
        return isMatch;
    };

    obtainRolesFromKeycloakJWT(request: any): Array<string> {
        try {
            console.log("obtainRolesFromKeycloakJWT process...");
            const token = extractTokenFromHeader(request.headers);
            const jwtDecoded = jwt.decode(token);
            console.log("RolesGuard.request.toke decoded:", jwtDecoded);

            let clientRoles = [];

            const key = this.globalConfig.get<string>('Keycloak_client_id');

            if (jwtDecoded.resource_access[key] && jwtDecoded.resource_access[key].roles) {
                if (jwtDecoded.resource_access[key].roles instanceof Array)
                    clientRoles = jwtDecoded.resource_access[key].roles;
            }

            let accountRoles = [];

            if (jwtDecoded.resource_access['account'] && jwtDecoded.resource_access['account'].roles) {
                if (jwtDecoded.resource_access['account'].roles instanceof Array)
                    clientRoles = jwtDecoded.resource_access['account'].roles;
            }

            let roles = [];

            if (jwtDecoded.roles) {
                if (jwtDecoded.roles instanceof Array)
                    roles = jwtDecoded.roles;
            }

            let rolesFromJWT: Array<string> = clientRoles.concat(accountRoles);
            rolesFromJWT = rolesFromJWT.concat(roles);

            console.log("RolesGuard.request.toke roles:", rolesFromJWT);

            return rolesFromJWT;
        } catch (e) {
            console.log("RolesGuard exception:", e);
            return [];
        }
    };

}
