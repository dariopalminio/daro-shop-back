import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IAuth } from 'src/domain/infra-interface/auth.interface';
//import { IServiceResponse } from 'src/domain/model/service/service-response.interface';
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';
import { ITranslator } from 'src/domain/infra-interface/translator.interface';
import { IGlobalConfig } from 'src/domain/infra-interface/global-config.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { AuthClientType } from 'src/domain/model/auth/token/auth.client.type';
import { RequestRefreshTokenType } from 'src/domain/model/auth/token/auth.request.refresh.token.type';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.type';


type NewUserRepresentationType = {
  username: string
  enabled: string
  emailVerified: string
  firstName: string
  lastName: string
  email: string
  credentials: [
    {
      type: string,
      value: string,
      temporary: string,
    },
  ],
};

type LoginRequestType = {
  username: string
  password: string
  grant_type: string
  client_id: string
  client_secret: string
};

type ConfirmEmailType = {
  username: string
  enabled: string
  emailVerified: string
  email: string
  //attributes: {
  //  verificationCode: string,
  //},
};

/**
 * Keycloak
 */
@Injectable()
export class AuthKeycloakImpl implements IAuth {

  constructor(
    
    private readonly http: HttpService,
    @Inject('ITranslator')
    private readonly i18n: ITranslator,
    @Inject('IGlobalConfig')
    private readonly config: IGlobalConfig,
  ) { }

  /**
   * Register 
   * 
   * POST /auth/admin/realms/{realm}/users
   * 
   * Create a new user and email must be unique.
   * Keycloak POST Create user [SAT]. 
   * POST 'http://127.0.0.1:8180/auth/admin/realms/my-realm-test/users'
   * AUTHORIZATION: Bearer Token (Token is Admin Token)
   * HEADERS: Content-Type application/json
   * BODY: UserRepresentation
   * curl --location --request POST 'http://yourKeyclaokSSO.com/auth/admin/realms/YOUR-REALM/users' \
   * --header 'Content-Type: application/json' \
   * --header 'Authorization: Bearer <INSERT TOKEN HERE>' \
   * --data-raw '{"firstName":"James","lastName":"West", "email":"jw@test.com", "username":"james.west", "attributes": {"SomeId":"123"}}'
   * @param firstName 
   * @param lastname 
   * @param email 
   * @param password 
   * @param adminToken
   * @returns 
   */
  async register(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    adminToken: string): Promise<any> {

    let response: AxiosResponse<any>
    try {
      const access_token = adminToken;

      const body: NewUserRepresentationType = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        emailVerified: "false",
        username: username,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: "false",
          },
        ],
        enabled: "true",
      };

      //User endpoint
      const URL = this.config.get<string>('Keycloak_path_users');

      response = await this.http
        .post(
          URL,
          JSON.stringify(body),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

    } catch (error) {
      const msg = error.message ? error.message : "Unknown error when trying to register new user.";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", msg);
    }
    switch (response.status) {
      case HttpStatus.CREATED: //201
        return response.data;
      case HttpStatus.UNAUTHORIZED: //401
        throw new DomainError(HttpStatus.UNAUTHORIZED, response.statusText, response.data);
      case HttpStatus.FAILED_DEPENDENCY:
        throw new DomainError(HttpStatus.FAILED_DEPENDENCY, response.statusText, response.data);
      case HttpStatus.FORBIDDEN: //403: Keycloak Admin Rest API unknown_error for update user API. The admin user may be misconfigured. You haven't granted related permissions to your real.
        throw new DomainError(HttpStatus.FORBIDDEN, response.statusText, response.data);
      case HttpStatus.BAD_REQUEST: //400
        throw new DomainError(HttpStatus.BAD_REQUEST, response.statusText, response.data);
      case HttpStatus.CONFLICT: {//409
        const msg = await this.i18n.translate('auth.ERROR.USER_CONFLICT',);
        throw new DomainError(HttpStatus.CONFLICT, msg, response.data);
      }
      default:
        throw new DomainError(response.status, response.statusText, response.data);
    }

  };

  /**
   * Get User By username
   * 
   * GET /auth/admin/realms/{realm}/users
   * 
   * Get users returns an users, filtered according to username params.
   * @param username 
   * @param adminToken 
   * @returns 
   */
  async getUserInfoByAdmin(username: string, adminToken: string): Promise<any> {

    let result: AxiosResponse<any>;

    try {
      let access_token = adminToken;

      const URL = this.config.get<string>('Keycloak_path_users');

      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      result = await this.http
        .get(URL, {
          params: { username: username },
          headers: headers,
        })
        .toPromise();

    } catch (e: any) {
      const msg = e.message ? e.message : "Unknown error in get user by username";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, msg, e);
    };
    switch (result.status) {
      case HttpStatus.OK: {
        if (result.data && result.data[0]) {
          const user = { user: result.data[0] };
          return user; //successful
        }
        throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, "Unknown error in get user by username", {});
      }
      case HttpStatus.UNAUTHORIZED: //401
        throw new DomainError(HttpStatus.UNAUTHORIZED, result.statusText, result.data);
      case HttpStatus.FAILED_DEPENDENCY:
        throw new DomainError(HttpStatus.FAILED_DEPENDENCY, result.statusText, result.data);
      case HttpStatus.FORBIDDEN: //403: Keycloak Admin Rest API unknown_error for update user API. The admin user may be misconfigured. You haven't granted related permissions to your real.
        throw new DomainError(HttpStatus.FORBIDDEN, result.statusText, result.data);
      case HttpStatus.BAD_REQUEST: //400
        throw new DomainError(HttpStatus.BAD_REQUEST, result.statusText, result.data);
      default:
        throw new DomainError(result.status, result.statusText, result.data);
    }
  };

  /**
   * Delete user from Keycloak
   * 
   * DELETE /auth/admin/realms/{realm}/users/{Id}
   * 
   * @param authId 
   * @param accessToken 
   * @returns 
   */
  async deleteAuthUser(authId: string, accessToken: string): Promise<boolean> {

    let eraseResult: any;
    try {
      const URL = `${this.config.get<string>('Keycloak_path_users')}/${authId}`;
      const header = {
        Authorization: `Bearer ${accessToken}`,
      };

      eraseResult = await this.http.delete(URL, {
        headers: header,
      }).toPromise();

      switch (eraseResult.status) {
        case HttpStatus.OK: //200
          return true;
        case HttpStatus.NO_CONTENT: //204
          return true;
        //return { isSuccess: true, status: eraseResult.status, message: undefined, data: null }; //successful
        case HttpStatus.NOT_FOUND: //404
          throw new DomainError(HttpStatus.NOT_FOUND, eraseResult.statusText, eraseResult.data);
        default:
          throw new DomainError(eraseResult.status, eraseResult.statusText, eraseResult.data);
      }
    } catch (error) {
      const msg = error.message ? error.message : "Unknown error in delete user.";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, msg, error);
    }
  };

  /**
   * Login
   * 
   * POST /auth/realms/{realm}/protocol/openid-connect/token
   * 
   * Consumer cliente for login on Keycloak Server & Bearer Token & with client secret
   * configured with OpenID Endpoint configuration, Login with email = true and Access Type = public
   * Example of request:
   * curl --location --request POST 'http://localhost:8080/auth/realms/my-realm-test/protocol/openid-connect/token' \
   * --header 'Content-Type: application/x-www-form-urlencoded' \
   * --data-urlencode 'username=coco@gmail.com' \
   * --data-urlencode 'password=12345Asdfg' \
   * --data-urlencode 'grant_type=password' \
   * --data-urlencode 'client_id=my-client-test' \
   * --data-urlencode 'client_secret=2b525aa8-315c-4782-8e78-8b0da22c47f9'
   * 
   * Response example:
   * {
   *     "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqbVM2UGZhRXRqbXhVM1UxSmt2blhaQ2V0YkFYR3JWdzJpYl9ESXhVWW80In0.eyJleHAiOjE2MjU4OTAyNDYsImlhdCI6MTYyNTg5MDE4NiwianRpIjoiYTk2Mzg5YTktYWExZS00MzI3LTlkZmYtMTMwNzA5NDJjMGQ0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL215LXJlYWxtLXRlc3QiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYmI3M2M5NTMtNTdmNy00ZTcxLTlhZDUtMzQyZTRkNWYwNjdmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicmVzdC1jbGllbnQtdGVzdCIsInNlc3Npb25fc3RhdGUiOiJlNTFkODQyMC00NTk1LTQ3ZDQtOTJmMi1lOTczNjg1ZDdhMjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbXktcmVhbG0tdGVzdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImNvY28gY29jbyIsInByZWZlcnJlZF91c2VybmFtZSI6ImNvY29AZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6ImNvY28iLCJmYW1pbHlfbmFtZSI6ImNvY28iLCJlbWFpbCI6ImNvY29AZ21haWwuY29tIn0.J1nrm9hAvK2iOGbI8DL_AKE1SU1S1pzNaRp2UUXHP1Uj6VmZqzpDo8kvBALA5FVXBnjJ8r530OYjM7EJQtnZQqoyMRpaRGamFL6eaMTEt3_3626kJlTE5J2TqhzeGvj357FTxnF-XwBpxVUDpxiycCdkPdfFsSKqGji_7CdF9Sj5_-GwPhhKXgdz9j5QOUteZrnFecWlLtvZU2NDsaICOkMkQQIyYgipSczOPwcfVVDe8POCWwWg4F10BIZuE49j3qVMmHMIgktE1wWaZ9MU63_ChmOCtNYxLE7o3gi550YSt9QZVKkH4SSnQHXvKfmxBTAGeopsl4vlLSIMgipZwg",
   *     "expires_in": 60,
   *     "refresh_expires_in": 60,
   *     "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MTU1Yzk2ZS05OWVkLTQzOWYtODMwZi00MDNlYzI1OWI5NzYifQ.eyJleHAiOjE2MjU4OTAyNDYsImlhdCI6MTYyNTg5MDE4NiwianRpIjoiZTcwZDE4MWQtODIzYy00NTI4LTlmNWUtNmVlNjNhNWI2NDI5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL215LXJlYWxtLXRlc3QiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbXktcmVhbG0tdGVzdCIsInN1YiI6ImJiNzNjOTUzLTU3ZjctNGU3MS05YWQ1LTM0MmU0ZDVmMDY3ZiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJyZXN0LWNsaWVudC10ZXN0Iiwic2Vzc2lvbl9zdGF0ZSI6ImU1MWQ4NDIwLTQ1OTUtNDdkNC05MmYyLWU5NzM2ODVkN2EyNCIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSJ9.MACJO2Go3MdzYz-3o0jyf9v6SWR0S96rJWdbOWvaOMg",
   *     "token_type": "Bearer",
   *     "not-before-policy": 0,
   *     "session_state": "e51d8420-4595-47d4-92f2-e973685d7a24",
   *     "scope": "email profile"
   * }
   * 
   * @param param0 loginRequestData LoginRequest
   * @returns access_token JWT 
   */
  async login(username: string, pass: string): Promise<any> {

    const body: LoginRequestType = {
      username: username,
      password: pass,
      grant_type: 'password',
      client_id: this.config.get<string>('Keycloak_client_id'),
      client_secret: this.config.get<string>('Keycloak_client_secret')
    };

    //Login endpoint
    const URL = this.config.get<string>('Keycloak_path_token');

    //post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    const response: AxiosResponse<any> = await this.http.post(URL, stringify(body)).toPromise();

    switch (response.status) {
      case HttpStatus.OK: {//200
        const msg = await this.i18n.translate('auth.MESSAGE.LOGGED_IN_OK',);
        return response.data; //successful
      }
      case HttpStatus.UNAUTHORIZED: {//401
        const msg = await this.i18n.translate('auth.ERROR.UNAUTHORIZED',);
        throw new DomainError(HttpStatus.UNAUTHORIZED, msg, response.data);
      }
      default:
        throw new DomainError(response.status, response.statusText, response);
    }

  };

  /**
   * Remove all user sessions associated with the user Also send notification to all clients that have an 
   * admin URL to invalidate the sessions for the particular user.
   * 
   * POST /{realm}/users/{id}/logout
   * 
   * @param userId 
   * @param adminToken 
   * @returns 
   */
  async logout(userId: string, adminToken: string): Promise<boolean> {
    try {
      //User endpoint
      const URL = `${this.config.get<string>('Keycloak_path_users')}/${userId}/logout`;

      const header = {
        Authorization: `Bearer ${adminToken}`,
      };

      const response: AxiosResponse<any> = await this.http.post(URL,
        JSON.stringify({}),
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }).toPromise();

      switch (response.status) {
        case HttpStatus.NO_CONTENT: {//204
          const msg = await this.i18n.translate('auth.MESSAGE.LOGGED_OUT_OK',);
          return true; //successful
        }
        case HttpStatus.UNAUTHORIZED: {//401
          const msg = await this.i18n.translate('auth.ERROR.UNAUTHORIZED',);
          throw new DomainError(HttpStatus.UNAUTHORIZED, msg, response.data);
        }
        case HttpStatus.NOT_FOUND: { //404
          const msg = await this.i18n.translate('auth.ERROR.NOT_FOUND',);
          throw new DomainError(HttpStatus.NOT_FOUND, msg, response.data);
        }
        default:
          throw new DomainError(response.status, response.statusText, response.data);
      }
    } catch (error) {
      const msg = error.message ? error.message : "Unknown error in login.";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, msg, error);
    }
  };

  /**
   * Confirm Email
   * 
   * POST /auth/admin/realms/{realm}/users/{Id}
   * 
   * It asks the auth server to update the verification field of the email to true.
   * Keycloak: PUT Update the user [SAT]
   * call to: <http://keycloak-IP:port>/auth/admin/realms/heroes/users/<userId>
   * with PUT command 
   * and with header 'Content-Type: application/json' \
   * and --data-raw in body with data emailVerified=true in next json structure: '{
   *    "id": "56f6c53f-5150-4b42-9757-4c3dd4e7d947",
   *    "createdTimestamp": 1588881160516,
   *    "username": "Superman",
   *    "enabled": true,
   *    "totp": false,
   *    "emailVerified": true,
   *    "firstName": "Clark",
   *    "lastName": "Kent",
   *    "email": "superman@kael.com",
   *    "disableableCredentialTypes": [],
   *    "requiredActions": [],
   *    "federatedIdentities": [],
   *    "notBefore": 0,
   *    "access": {
   *        "manageGroupMembership": true,
   *        "view": true,
   *        "mapRoles": true,
   *        "impersonate": true,
   *        "manage": true
   *    }
   *}'
   * @param userId 
   * @param adminToken 
   */
  async confirmEmail(userId: string, userEmail: string, adminToken: string): Promise<boolean> {
    try {
      const body: ConfirmEmailType = {
        email: userEmail,
        emailVerified: "true",
        username: userEmail,
        enabled: "true",
      };

      //User endpoint
      const URL = `${this.config.get<string>('Keycloak_path_users')}/${userId}`;

      const response: AxiosResponse<any> = await this.http.put(
        URL,
        JSON.stringify(body),
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }).toPromise();
      console.log('auth keicloak confirmEmail:', response);
      switch (response.status) {
        case HttpStatus.NO_CONTENT: //204 
          return true; //successful
        case HttpStatus.UNAUTHORIZED: //401
          throw new DomainError(HttpStatus.UNAUTHORIZED, await this.i18n.translate('auth.ERROR.UNAUTHORIZED',), response.data);
        case HttpStatus.NOT_FOUND: //404 
          throw new DomainError(HttpStatus.NOT_FOUND, await this.i18n.translate('auth.ERROR.NOT_FOUND',), response.data);
        default:
          throw new DomainError(response.status, response.statusText, response.data);
      }
    } catch (error) {
      const msg = error.message ? error.message : "Unknown error in confirm email.";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, msg, error);
    }
  };

  /**
   * Set up a new password for the user.
   * 
   * PUT /{realm}/users/{id}/reset-password
   * 
   * @param userId 
   * @param newPassword 
   * @param adminToken 
   * @returns 
   */
  async resetPassword(
    userId: string,
    newPassword: string,
    adminToken: string
  ): Promise<boolean> {
    try {
      const body = {
        type: 'password',
        temporary: false,
        value: newPassword,
      };

      //User endpoint
      const URL = `${this.config.get<string>('Keycloak_path_users')}/${userId}/reset-password`;

      const res = await this.http
        .put(
          URL,
          JSON.stringify(body),
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      switch (res.status) {
        case HttpStatus.NO_CONTENT: {//204
          //const msgSuccess = await this.i18n.translate('auth.MESSAGE.PASS_UPDATED_OK',);
          return true; //successful
        }
        case HttpStatus.UNAUTHORIZED: //401
          throw new DomainError(HttpStatus.UNAUTHORIZED, await this.i18n.translate('auth.ERROR.UNAUTHORIZED',), res.data);
        case HttpStatus.BAD_REQUEST: //400 no puede repetir contraseña
          throw new DomainError(HttpStatus.BAD_REQUEST, res.statusText, res.data);
        default:
          throw new DomainError(res.status, res.statusText, res.data);
      }
    } catch (error) {
      const msg = error.message ? error.message : "Unknown error in confirm email.";
      throw new DomainError(HttpStatus.INTERNAL_SERVER_ERROR, msg, error);
    }
  };

  /**
 * Get Admin Token
 * 
 * POST /auth/realms/{realm}/protocol/openid-connect/token
 * 
 * Get a admin access token (from auth server) for next time can create user or update user.
 * same login url: `/auth/realms/${your-realm}/protocol/openid-connect/token`,
 * headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
*/
  async getAdminToken(body: NewAdminTokenRequestType): Promise<any> {

    // Token endpoint
    const URL = this.config.get<string>('Keycloak_path_token');

    const params = new URLSearchParams();
    params.append('client_id', body.client_id);
    params.append('grant_type', body.grant_type);
    params.append('username', body.username);
    params.append('password', body.password);
    params.append('scope', body.scope);
    params.append('client_secret', body.client_secret);

    const response = await this.http.post(URL, params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    ).toPromise();

    switch (response.status) {
      case HttpStatus.OK: //200
        return response.data; //response.data.access_token
      case HttpStatus.UNAUTHORIZED: //401
        throw new DomainError(HttpStatus.UNAUTHORIZED, response.statusText, response.data);
      case HttpStatus.FAILED_DEPENDENCY:
        throw new DomainError(HttpStatus.FAILED_DEPENDENCY, response.statusText, response.data);
      case HttpStatus.FORBIDDEN: //403: Keycloak Admin Rest API unknown_error for update user API. The admin user may be misconfigured. You haven't granted related permissions to your real.
        throw new DomainError(HttpStatus.FORBIDDEN, response.statusText, response.data);
      case HttpStatus.BAD_REQUEST: //400
        throw new DomainError(HttpStatus.BAD_REQUEST, response.statusText, response.data);
      default:
        throw new DomainError(response.status, response.statusText, response.data);
    }

  };

  //for local use
  async getAdminStringToken(): Promise<string> {

    const body: NewAdminTokenRequestType = {
      client_id: this.config.get<string>('Keycloak_client_id'),
      grant_type: 'password',
      username: this.config.get<string>('Keycloak_username_admin'),
      password: this.config.get<string>('Keycloak_password_admin'),
      scope: 'openid roles',
      client_secret: this.config.get<string>('Keycloak_client_secret'),
    };

    const data = await this.getAdminToken(body);
    const { access_token } = data;
    return access_token;
  };

  /**
   * Get App Token
   * 
   * Get Access Token for application from auth server.
   * 
   * Obtain SAT (service account token).
   * Method POST[SAT] Obtain accsess token from a service account. 
   * Content-Type: application/x-www-form-urlencoded.
   * Body with client_id, client_secret and grant_type.
  */
  async getAppToken(authClientDTO: AuthClientType): Promise<any> {

    // Token endpoint
    const URL = this.config.get<string>('Keycloak_path_token');

    const params = new URLSearchParams();
    params.append('client_id', authClientDTO.client_id);
    params.append('client_secret', authClientDTO.client_secret);
    params.append('grant_type', authClientDTO.grant_type);

    const response = await this.http.post(URL, params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    ).toPromise();

    switch (response.status) {
      case HttpStatus.OK: //200
        return response.data; //response.data.access_token
      case HttpStatus.UNAUTHORIZED: //401
        throw new DomainError(HttpStatus.UNAUTHORIZED, response.statusText, response.data);
      case HttpStatus.FAILED_DEPENDENCY:
        throw new DomainError(HttpStatus.FAILED_DEPENDENCY, response.statusText, response.data);
      case HttpStatus.FORBIDDEN: //403: Keycloak Admin Rest API unknown_error for update user API. The admin user may be misconfigured. You haven't granted related permissions to your real.
        throw new DomainError(HttpStatus.FORBIDDEN, response.statusText, response.data);
      case HttpStatus.BAD_REQUEST: //400
        throw new DomainError(HttpStatus.BAD_REQUEST, response.statusText, response.data);
      default:
        throw new DomainError(response.status, response.statusText, response.data);
    }
  };


  /**
   * Get Refresh Token
   * 
   * getRefreshTokenService is used when you need to make the user keep login in the system 
   * if the user's access_token get expired and user want to keep login. How can I get newly 
   * updated access_token with this function.
   * Use Refresh Tokens
   * Method: POST
   * URL: https://keycloak.example.com/auth/realms/myrealm/protocol/openid-connect/token
   * Body type: x-www-form-urlencoded
   * Form fields:
   * client_id : <my-client-name>
   * grant_type : refresh_token
   * refresh_token: <my-refresh-token>
   * 
   * @param refresh_token 
   * @returns 
   */
  async getRefreshToken(body: RequestRefreshTokenType): Promise<any> {

    // Token endpoint
    const URL = this.config.get<string>('Keycloak_path_token');

    const params = new URLSearchParams();
    params.append('client_id', body.client_id);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', body.refresh_token);
    params.append('client_secret', body.client_secret);

    const response = await this.http.post(URL, params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    ).toPromise();

    switch (response.status) {
      case HttpStatus.OK: //200
        return response.data; //response.data.access_token
      case HttpStatus.UNAUTHORIZED: //401
        throw new DomainError(HttpStatus.UNAUTHORIZED, response.statusText, response.data);
      case HttpStatus.FAILED_DEPENDENCY:
        throw new DomainError(HttpStatus.FAILED_DEPENDENCY, response.statusText, response.data);
      case HttpStatus.FORBIDDEN: //403: Keycloak Admin Rest API unknown_error for update user API. The admin user may be misconfigured. You haven't granted related permissions to your real.
        throw new DomainError(HttpStatus.FORBIDDEN, response.statusText, response.data);
      case HttpStatus.BAD_REQUEST: //400
        throw new DomainError(HttpStatus.BAD_REQUEST, response.statusText, response.data);
      default:
        throw new DomainError(response.status, response.statusText, response.data);
    }
  };

};
