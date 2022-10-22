
import { LoginFormDTO } from 'src/domain/model/auth/login/login-form.dto';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.dto';
import { AuthClientDTO } from 'src/domain/model/auth/token/auth.client.dto';
import { RequestRefreshToken } from 'src/domain/model/auth/token/auth.request.refresh.token.dto';
import { PayloadType } from 'src/domain/model/auth/token/payload.type';
import { TokensDTO } from 'src/domain/model/auth/token/tokens.dto';

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
    login(loginForm: LoginFormDTO): Promise<any>;
    getAppToken(authClientDTO: AuthClientDTO): Promise<any>;
    getAdminToken(body: NewAdminTokenRequestType): Promise<any>;
    getRefreshToken(body: RequestRefreshToken): Promise<any>;
    getPEMPublicKey(): string;
    createTokens(payload: PayloadType, accessExpiresIn: number, refreshExpireIn: number): TokensDTO;
    
};