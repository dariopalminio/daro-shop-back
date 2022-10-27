import { AuthClientType } from 'src/domain/model/auth/token/auth.client.type';
import { RequestRefreshTokenType } from 'src/domain/model/auth/token/auth.request.refresh.token.type';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.type';
  
export interface IAuth {

    getAdminToken(body: NewAdminTokenRequestType): Promise<any>;
    getAdminStringToken(): Promise<string>;
    getAppToken(authClientDTO: AuthClientType): Promise<any>;
    getRefreshToken(body: RequestRefreshTokenType): Promise<any>;

    register(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        adminToken: string): Promise<any>;
    
    getUserInfoByAdmin(username: string, adminToken: string): Promise<any>;
    
    deleteAuthUser(authId: string, accessToken: string): Promise<boolean>;

    confirmEmail(userId: string, userEmail: string, adminToken: string): Promise<boolean>;

    login(username: string, pass: string): Promise<any>;

    logout(userId: string, accessToken: string): Promise<boolean>;

    resetPassword(
        userId: string,
        newPassword: string,
        adminToken: string
      ): Promise<boolean>;

  }