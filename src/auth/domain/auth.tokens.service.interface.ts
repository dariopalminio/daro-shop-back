
import { LoginForm } from 'src/auth/domain/model/login/login-form';
import { NewAdminTokenRequestType } from 'src/auth/domain/model/token/auth.admin.type';
import { AuthClientType } from 'src/auth/domain/model/token/auth.client.type';
import { RequestRefreshTokenType } from 'src/auth/domain/model/token/auth.request.refresh.token.type';
import { PayloadType } from 'src/auth/domain/model/token/payload.type';
import { TokensType } from 'src/auth/domain/model/token/tokens.type';

/**
 * Auth Tokens Interface
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business logic, validations are happening in the use of case classes such as services. This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IAuthTokensService {
    test(): void;
    login(loginForm: LoginForm): Promise<any>;
    getAppToken(authClientDTO: AuthClientType): Promise<any>;
    getAdminToken(body: NewAdminTokenRequestType): Promise<any>;
    getRefreshToken(body: RequestRefreshTokenType): Promise<any>;
    getPEMPublicKey(): string;
    createTokens(payload: PayloadType, accessExpiresIn?: number, refreshExpireIn?: number): TokensType;
    
};