import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import extractTokenFromHeader from '../helper/token.helper';

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

            const rolesFromJWT = clientRoles.concat(accountRoles);

            console.log("RolesGuard.request.toke roles:", rolesFromJWT);

            return rolesFromJWT;
        } catch (e) {
            console.log("RolesGuard exception:", e);
            return [];
        }
    };

}

/**
Example of use...

  @UseGuards(RolesGuard)
  @Roles('admin', 'manage-account')
  @Put('profile/update')
  async updateProfile(@Res() res, @Body() userProfileDTO: UserProfileDTO){
    
    });
  };

 */