import { Injectable, Inject } from '@nestjs/common';
import IEmailSender from 'src/domain/outgoing/email-sender.interface';
import { IAuthTokensService } from 'src/domain/incoming/auth.tokens.service.interface';
import { TokensType } from 'src/domain/model/auth/token/tokens.type';
import jwt from "jsonwebtoken";
import { AuthClientType } from 'src/domain/model/auth/token/auth.client.type';
import { RequestRefreshTokenType } from 'src/domain/model/auth/token/auth.request.refresh.token.type';
import { NewAdminTokenRequestType } from 'src/domain/model/auth/token/auth.admin.type';
import { PayloadType } from '../model/auth/token/payload.type';
import { IUserService } from 'src/domain/incoming/user.service.interface';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { LoginForm } from 'src/domain/model/auth/login/login-form';
import { User } from 'src/domain/model/user/user';
import { InvalidClientCredentialsError, InvalidCredentialsError, RefreshTokenMalformedError, TokensCreationError } from 'src/domain/error/auth-errors';
import { UserNotFoundError } from '../error/user-errors';
const bcrypt = require('bcrypt');
import { DomainError, ErrorCode, IGlobalConfig } from "hexa-three-levels";

/**
 * Authorization Tokens service
 * 
 * Implements behavior associated with authentication tokens related to the 'User' domain object.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces.
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class AuthTokensService implements IAuthTokensService {

  private accessExpiresIn: number;
  private refreshExpireIn: number;

  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<User>,
    @Inject('IEmailSender')
    readonly sender: IEmailSender,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) {
    this.accessExpiresIn = 86400;
    this.refreshExpireIn = 86400 * 2;
  }

  async test() {

    // Encrypt hash of password
    const salt = await bcrypt.genSalt(10);
    const passwordCrypted: string = await bcrypt.hash('12345Qwert', salt);
    console.log('12345Qwert = ', passwordCrypted);

  }
  /**
   * Create access and refresh tokens using payload data input
   * @param payload profile data
   * @returns 
   */
  createTokens(payload: PayloadType, accessExpiresIn?: number, refreshExpireIn?: number): TokensType {

    try {
      let tokens: TokensType = {
        access_token: "",
        expires_in: 0,
        refresh_expires_in: 0,
        refresh_token: "",
        token_type: "Bearer",
        "not-before-policy": 0,
        session_state: "",
        scope: "profile email"
      };

      const privateKEY: string = this._getPrivateKey();

      const issuer = 'Dario Palminio';
      const subject = payload.id.toString();
      const audience = 'Dario Palminio';

      const accessSignOptions: any = {
        issuer: issuer,
        subject: subject,
        audience: audience,
        expiresIn: accessExpiresIn? accessExpiresIn : this.accessExpiresIn,
        algorithm: "RS256"
      };

      // Create a access token
      tokens.access_token = jwt.sign(payload, privateKEY, accessSignOptions);
      tokens.expires_in = accessSignOptions.expiresIn;

      const refreshSignOptions: any = {
        issuer: issuer,
        subject: subject,
        audience: audience,
        expiresIn: refreshExpireIn ? refreshExpireIn : this.refreshExpireIn, 
        algorithm: "RS256"
      };

      // Create a refresh token
      tokens.refresh_token = jwt.sign(payload, privateKEY, refreshSignOptions);
      tokens.refresh_expires_in = accessSignOptions.expiresIn;

      return tokens;
    } catch (error) {
      throw new TokensCreationError(error.message);
    }
  };

  /**
  * Create the PEM string base64 decode with auth public key
  * @returns 
  */
  private _getPrivateKey(): string {
    if (!this.globalConfig.get<string>('AUTH_PRIVATE_KEY') || this.globalConfig.get<string>('AUTH_PRIVATE_KEY') === '')
      throw Error("The public key is wrong!");
    let pem = '';
    pem += '-----BEGIN RSA PRIVATE KEY-----\n';
    pem += this.globalConfig.get<string>('AUTH_PRIVATE_KEY');
    pem += '\n';
    pem += '-----END RSA PRIVATE KEY-----\n';
    return pem;
  };

  getPEMPublicKey(): string {
    if (!this.globalConfig.get<string>('AUTH_PUBLIC_KEY') || this.globalConfig.get<string>('AUTH_PUBLIC_KEY') === '')
      throw Error("The public key is wrong!");
    let pem = '';
    pem += '-----BEGIN PUBLIC KEY-----\n';
    pem += this.globalConfig.get<string>('AUTH_PUBLIC_KEY');
    pem += '\n';
    pem += '-----END PUBLIC KEY-----\n';
    return pem;
  };

  verifyClient(clientId: string, clientSecret: string): boolean {
    if ((clientId !== this.globalConfig.get('Keycloak_client_id')) ||
      (clientSecret !== this.globalConfig.get('Keycloak_client_secret'))) return false;
    return true;
  };

  /**
   * login
   * @param loginForm 
   * @returns 
   */
  async login(loginForm: LoginForm): Promise<any> {

    let user: User;
    try {
      user = await this.userService.getByQuery({ userName: loginForm.userName });
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new InvalidCredentialsError(`Unauthorized. User ${loginForm.userName} not found! Cannot obtain user from data base!`);
    }
    if (!user)
      throw new InvalidCredentialsError(`Unauthorized. User ${loginForm.userName} not found!`);

    const validPassword = await bcrypt.compare(loginForm.password, user.getPassword());

    if (!validPassword)
      throw new InvalidCredentialsError(`Unauthorized. Password is invalid!`);

    const userId: string | undefined = user.getId();
    if (userId === undefined) throw new UserNotFoundError('Cannot obtain user id from data base!');

    const payload: PayloadType = {
      id: userId,
      typ: "Bearer",
      roles: user.getRoles(),
      email_verified: user.getVerified(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      userName: user.getUserName(),
      email: user.getEmail()
    };

    const tokens: TokensType = this.createTokens(payload, this.accessExpiresIn, this.refreshExpireIn);

    return tokens;
  };

  /**
    * Get a admin access token (from auth server) for next time can create user or update user.
    */
  async getAdminToken(body: NewAdminTokenRequestType): Promise<any> {

    //grant_type=password
    const isClient: boolean = this.verifyClient(body.client_id, body.client_secret);
    if (isClient === false) {
      throw new InvalidClientCredentialsError(`Is not a client! Client id or client secret are invalid!`);
    }

    let user: User;
    try {
      user = await this.userService.getByQuery({ userName: body.userName });
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new InvalidCredentialsError(`Unauthorized. User ${body.userName} not found! Cannot obtain user from data base!`);
    }
    if (!user) {
      throw new InvalidCredentialsError(`Unauthorized. User ${body.userName} not found!`);
    }

    const validPassword = await bcrypt.compare(body.password, user.getPassword());

    if (!validPassword) {
      throw new InvalidCredentialsError(`Unauthorized. Password is invalid!`);
    }

    if (!user.hasRole(RolesEnum.ADMIN)) {
      throw new InvalidCredentialsError(`User is not Admin! To grant an admin token the user must be an admin`);
    }

    const userId: string | undefined = user.getId();
    if (userId === undefined) {
      throw new UserNotFoundError('Cannot obtain user id from data base!');
    }

    const payload: PayloadType = {
      id: userId,
      typ: "Bearer",
      roles: user.getRoles(),
      email_verified: user.getVerified(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      userName: user.getUserName(),
      email: user.getEmail()
    };

    const tokens: TokensType = this.createTokens(payload, this.accessExpiresIn, this.refreshExpireIn);

    return tokens;
  };

  /**
   * Obtain app accsess token from a service account
   */
  async getAppToken(authClientDTO: AuthClientType): Promise<any> {

    //grant_type=client_credentials
    try {
      if (!authClientDTO.client_id || !authClientDTO.client_secret || !authClientDTO.grant_type)
        throw new Error("Bad Request: Empty value!");
    } catch (error) {
      throw new InvalidClientCredentialsError(`The client_id, client_secret or grant_type is empty`,
        {}, ErrorCode.BAD_REQUEST);
    };

    const isClient: boolean = this.verifyClient(authClientDTO.client_id, authClientDTO.client_secret);
    if (!isClient)
      throw new InvalidClientCredentialsError(`Is not a client! Client id and client secret are invalid!`,
        {}, ErrorCode.BAD_REQUEST);

    const payload: PayloadType = {
      id: authClientDTO.client_id,
      typ: "Bearer",
      roles: [RolesEnum.APP],
      email_verified: true,
      firstName: "App",
      lastName: "App",
      userName: authClientDTO.client_id,
      email: authClientDTO.client_id
    };

    const tokens: TokensType = this.createTokens(payload, this.accessExpiresIn, this.refreshExpireIn);

    return tokens;
  };

  /**
   * Get Refresh Token
   * 
   * getRefreshToken is used when you need to make the user keep login in the system 
   * if the user's access_token get expired and user want to keep login. How can I get newly 
   * updated access_token with this function.
   */
  async getRefreshToken(body: RequestRefreshTokenType): Promise<any> {


    if (!body)
      throw new RefreshTokenMalformedError();


    const isClient: boolean = this.verifyClient(body.client_id, body.client_secret);
    if (!isClient)
      throw new InvalidClientCredentialsError(`Is not a client! Client id and client secret are invalid!`);

    let payload: PayloadType;

    try {
      const jwtDecoded = jwt.decode(body.refresh_token);

      payload = {
        id: jwtDecoded.id,
        typ: "Bearer",
        roles: jwtDecoded.roles, //["app"],
        email_verified: jwtDecoded.email_verified,
        firstName: jwtDecoded.firstName,
        lastName: jwtDecoded.lastName,
        userName: jwtDecoded.username,
        email: jwtDecoded.email
      };
    } catch (error) {
      throw new RefreshTokenMalformedError("JWT in Refresh token malformed!");
    };

    const tokens: TokensType = this.createTokens(payload, this.accessExpiresIn, this.refreshExpireIn);

    return tokens;
  };


};