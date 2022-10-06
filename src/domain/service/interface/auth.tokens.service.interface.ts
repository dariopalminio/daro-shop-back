
import { LoginFormDTO } from 'src/domain/model/auth/login/login-form.dto';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.dto';
import { AuthClientDTO } from 'src/domain/model/auth/token/auth.client.dto';
import { RequestRefreshToken } from 'src/domain/model/auth/token/auth.request.refresh.token.dto';
import { PayloadType } from 'src/domain/model/auth/token/payload.type';
import { TokensDTO } from 'src/domain/model/auth/token/tokens.dto';

export interface IAuthTokensService {
    test(): void;
    login(loginForm: LoginFormDTO): Promise<any>;
    getAppToken(authClientDTO: AuthClientDTO): Promise<any>;
    getAdminToken(body: NewAdminTokenRequestType): Promise<any>;
    getRefreshToken(body: RequestRefreshToken): Promise<any>;
    getPEMPublicKey(): string;
    createTokens(payload: PayloadType, accessExpiresIn: number, refreshExpireIn: number): TokensDTO;
    
};