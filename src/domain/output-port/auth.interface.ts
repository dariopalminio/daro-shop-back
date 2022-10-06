import { AuthClientDTO } from 'src/domain/model/auth/token/auth.client.dto';
import { RequestRefreshToken } from 'src/domain/model/auth/token/auth.request.refresh.token.dto';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.dto';
  
export interface IAuth {

    getAdminToken(body: NewAdminTokenRequestType): Promise<any>;
    getAdminStringToken(): Promise<string>;
    getAppToken(authClientDTO: AuthClientDTO): Promise<any>;
    getRefreshToken(body: RequestRefreshToken): Promise<any>;

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