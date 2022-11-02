import { Injectable } from '@nestjs/common';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import * as pack from "../../../package.json"

require('dotenv').config();

/**
 * GlobalConfigImpl
 */
@Injectable()
export class GlobalConfigImpl implements IGlobalConfig{
    
    variables: Map<string, any> = new Map();

    constructor(
    ) { 
        this.loadDefaultValues();
    };

    private loadAppInfo(){
        this.set('APP_NAME', pack.name as string);
        this.set('VERSION', pack.version as string);
        this.set('DESCRIPTION', pack.description as string);
        this.set('LICENSE', pack.license as string);
    }

    private loadDefaultValues(){
        this.loadAppInfo();
        this.set('environment', process.env.SERVER_BFF_ENV as string);
        this.set('DEBUG', ((process.env.SERVER_BFF_DEBUG === 'true') ? true : false) as boolean);
        this.set('COMPANY_NAME', process.env.SERVER_BFF_COMPANY_NAME as string);
        this.set('PORT', Number(process.env.SERVER_BFF_PORT) as number);
        this.set('DOMAIN', (process.env.SERVER_BFF_DOMAIN) as string);

        this.set('PREFIX_ROUTE', process.env.SERVER_BFF_PREFIX_ROUTE as string);
        if (process.env.SERVER_BFF_AUTH_MIDDLEWARE_ON){
        this.set('AUTH_MIDDLEWARE_ON', (process.env.SERVER_BFF_AUTH_MIDDLEWARE_ON.toLowerCase() == 'true' ? true : false) as boolean); 
        }else{
            this.set('AUTH_MIDDLEWARE_ON', false as boolean); 
        }
        this.set('EXPIRATION_DAYS_LIMIT', Number(process.env.SERVER_BFF_AUTH_EXPIRATION_DAYS_LIMIT) as number);

        // Data base params

        this.set('DB_MONGO_ON_SERVER', process.env.SERVER_BFF_MONGO_ON_SERVER as string);
        this.set('DB_MONGO_DB', process.env.SERVER_BFF_MONGO_DB as string);
        this.set('DB_MONGO_HOST', process.env.SERVER_BFF_MONGO_HOST as string);
        this.set('DB_MONGO_USERNAME', process.env.SERVER_BFF_MONGO_USERNAME as string);
        this.set('DB_MONGO_USERPASSWORD', process.env.SERVER_BFF_MONGO_USERPASSWORD as string);

        // Params to email server

        this.set('EMAIL_HOST', process.env.SERVER_BFF_EMAIL_HOST as string);
        this.set('EMAIL_PORT', Number(process.env.SERVER_BFF_EMAIL_PORT) as number);
        this.set('EMAIL_USER', process.env.SERVER_BFF_EMAIL_USER as string);
        this.set('EMAIL_PASS', process.env.SERVER_BFF_EMAIL_PASS as string);
        this.set('EMAIL_FROM', process.env.SERVER_BFF_EMAIL_FROM as string);
        this.set('EMAIL_APP_NAME', process.env.SERVER_BFF_EMAIL_APP_NAME as string);

        this.set('PUBLIC_KEY', process.env.SERVER_BFF_KEYCLOAK_PUBLIC_KEY as string);

        this.set('AUTH_PRIVATE_KEY', process.env.SERVER_BFF_AUTH_PRIVATE_KEY as string);
        this.set('AUTH_PUBLIC_KEY', process.env.SERVER_BFF_AUTH_PUBLIC_KEY as string);
        

        this.set('is_fake_mode', ((process.env.SERVER_BFF_FAKE === 'true') ? true : false) as boolean);

        // Keycloak authentication server

        const APIEndpoints_auth: string = (process.env.SERVER_BFF_AUTH_API ? process.env.SERVER_BFF_AUTH_API : 'http://localhost:8080') as string;

        this.set('APIEndpoints_auth', APIEndpoints_auth);
        
        const Keycloak_realm: string = process.env.SERVER_BFF_AUTH_REALM as string;

        this.set('Keycloak_realm', Keycloak_realm);
        this.set('Keycloak_client_id', process.env.SERVER_BFF_AUTH_CLIENT_ID as string);
        this.set('Keycloak_client_secret', process.env.SERVER_BFF_AUTH_CLIENT_SECRET as string);
        this.set('Keycloak_username_admin', process.env.SERVER_BFF_AUTH_USERNAME_ADMIN as string);
        this.set('Keycloak_password_admin', process.env.SERVER_BFF_AUTH_PASSWORD_ADMIN as string);
        this.set('Keycloak_verify_email', ((process.env.SERVER_BFF_AUTH_VERIFY_EMAIL === 'true') ? true : false) as boolean);

        this.set('Keycloak_path_user_info', `${APIEndpoints_auth}/auth/realms/${Keycloak_realm}/protocol/openid-connect/userinfo`);
        this.set('Keycloak_path_users',  `${APIEndpoints_auth}/auth/admin/realms/${Keycloak_realm}/users`);
        this.set('Keycloak_path_token', `${APIEndpoints_auth}/auth/realms/${Keycloak_realm}/protocol/openid-connect/token`);

    };

    get<R>(key: string): R {
        return this.variables.get(key) as R;
    };

    set<R>(key: string, value: R): void {
        this.variables.set(key,value);
    };

    stringify(): string {
        return JSON.stringify(Object.fromEntries(this.variables)); 
    };

};
