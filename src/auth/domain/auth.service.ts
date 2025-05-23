import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from 'src/auth/domain/auth.service.interface';
import { IUserService } from 'src/auth/domain/user.service.interface';
import IEmailSender from 'src/notification/domain/email-sender.interface';
import { isUrlValid } from 'src/auth/domain/helper/url.helper';
import { generateToken, encodeToken, createTokenLink, decodeToken } from './helper/token.helper';
import { StartConfirmEmailData } from 'src/auth/domain/model/register/start-confirm-email-data';
import { ParamsRegisterStart } from 'src/auth/domain/model/register/params-register-start';
import { StartRecoveryDataType } from 'src/auth/domain/model/recovery/start-recovery-data.type';
import { VerificationCodeDataType } from 'src/auth/domain/model/register/verification-code-data.type';
import { RecoveryUpdateDataType } from 'src/auth/domain/model/recovery/recovery-update-data.type';
import { LogoutForm } from 'src/auth/domain/model/login/logout-form';
import { User } from 'src/auth/domain/model/user/user';
import { IAuthTokensService } from 'src/auth/domain/auth.tokens.service.interface';
import { PayloadType } from 'src/auth/domain/model/token/payload.type';
import { TokensType } from 'src/auth/domain/model/token/tokens.type';
import { RolesEnum } from 'src/auth/domain/model/reles.enum';
import { RegisterForm } from 'src/auth/domain/model/register/register-form';
import { InvalidVerificationCodeError } from 'src/auth/domain/auth-errors';
import { UserDuplicateError, UserFormatError, UserNotFoundError } from 'src/auth/domain/user-errors';
const bcrypt = require('bcrypt');
import { DomainError, ErrorCode, IGlobalConfig } from "hexa-three-levels";
import { isEmailValid } from 'src/common/domain/helper/email.validator';

/**
 * Auth service
 * 
 * It implements the behavior associated with authentication and authorization related to the 'User' domain object.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces.
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<User>,
    @Inject('IEmailSender')
    readonly sender: IEmailSender,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
    @Inject('IAuthTokensService')
    private readonly authTokensService: IAuthTokensService,
  ) {
  }


  /**
   * Register
   * 
   * Create a new user in authentication server and in data base.
   * The user will have the email without confirming until he confirms it.
   * Require Admin token
   * @param userRegisterData 
   * @returns 
   */
  async register(userRegisterData: RegisterForm): Promise<any> {

    //const isEmailExist = await User.findOne({ email: req.body.email });
    const isEmailExist: boolean = await this.userService.hasByQuery({ email: userRegisterData.email });
    if (isEmailExist) {
      throw new UserDuplicateError('The Email just was registered');
    }

    // Create new user in user database
    let newObj: User = new User();
    try {
      // Encrypt hash of password
      const salt = await bcrypt.genSalt(10);
      const passwordCrypted: string = await bcrypt.hash(userRegisterData.password, salt);
      //set user data
      newObj.setUsername(userRegisterData.email); //userName is email
      newObj.setFirstName(userRegisterData.firstName);
      newObj.setLastName(userRegisterData.lastName);
      newObj.setEmail(userRegisterData.email);
      newObj.setPassword(passwordCrypted);
      newObj.setRoles([RolesEnum.USER]);
      newObj.setVerified(false);
      newObj.setEnable(true);
    } catch (error) {
      throw new UserFormatError(`Error when trying to create user instance. ${error.message}`);
    }

    let userNew: User;

    userNew = await this.userService.create(newObj);

    let userCreated: User | null = null;
    let payload: PayloadType | null = null;
    if (userNew) {
      try {
        userCreated = await this.userService.getUserJustRegister(userRegisterData.email);
      } catch (error) {
        console.log("Cannot retrieve created user in registration process!");
        throw new UserNotFoundError('Cannot obtain user from data base!');
      }
    }

    if (!userCreated || userCreated === null)
      return { message: 'Cannot obtain user from data base!' }

    const userId: string | undefined = userCreated.getId();

    if (userId === undefined) throw new UserNotFoundError('User Id is undefined!');

    payload = {
      id: userId ? userId : '',
      typ: "Bearer",
      roles: userCreated.getRoles(),
      email_verified: userCreated.getVerified(),
      firstName: userCreated.getFirstName(),
      lastName: userCreated.getLastName(),
      username: userCreated.getUsername(),
      email: userCreated.getEmail()
    };

    const tokens: TokensType = this.authTokensService.createTokens(payload);

    return tokens;
  };

  /**
   * Send Start Email Confirm
   * Send an email-verification email to the user An email contains a link the user can click to verify their email address.
   * 
   * @param startConfirmEmailData 
   * @returns 
   */
  async sendStartEmailConfirm(startConfirmEmailData: StartConfirmEmailData, locale: string): Promise<any> {

    // Data validation
    if (!isEmailValid(startConfirmEmailData.email)) {
      throw new UserFormatError("Invalid email to email confirmation!");
    }

    if (!startConfirmEmailData.verificationPageLink ||
      !isUrlValid(startConfirmEmailData.verificationPageLink)) {
      throw new UserFormatError("Invalid link to email confirmation!");
    }

    let user: User;
    try {
      // Get user
      const query = { username: startConfirmEmailData.username };
      user = await this.userService.getByQuery(query);
      if (!user) throw new Error("User not found!");
    } catch (error) {
      throw new UserNotFoundError(error.message, error);
    };

    try {
      // Generate new verification code
      const newVerificationCode = generateToken();
      user.setVerificationCode(newVerificationCode);

      const userId: string | undefined = user.getId();
      if (userId === undefined) throw new UserNotFoundError('User with out Id.');

      const updatedOk: boolean = await this.userService.updateById(userId, user);
      if (updatedOk === false) throw new Error("Can not save generated verification code!");

      const token: string = encodeToken(startConfirmEmailData.email, newVerificationCode);
      const verificationLink = createTokenLink(startConfirmEmailData.verificationPageLink, token);

      // Prepare params tu email template
      const paramsRegisterStart: ParamsRegisterStart = new ParamsRegisterStart();
      paramsRegisterStart.name = startConfirmEmailData.name;
      paramsRegisterStart.company = this.globalConfig.get<string>('COMPANY_NAME');
      paramsRegisterStart.link = verificationLink;
      const subject: string = `[${paramsRegisterStart.company}] Password changed`;

      //Send email
      const emailResponse: any = await this.sender.sendEmailWithTemplate(subject, startConfirmEmailData.email, "register-start", paramsRegisterStart, locale);
      return {
        isSuccess: true,
        status: ErrorCode.OK,
        message: "An email-verification was sent to the user with a link the user can click to verify their email address!",
        data: emailResponse
      };

    } catch (error) {
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, error);
    };
  };

  /**
   * Confirm Account
   * Confirm account from an email-verification action by user.
   * 
   * @param verificationCodeData 
   * @returns 
   */
  async confirmAccount(verificationCodeData: VerificationCodeDataType, lang: string): Promise<any> {

    let user: User;

    user = await this.verificateToken(verificationCodeData.token);

    const userId: string | undefined = user.getId();
    if (userId === undefined) throw new UserNotFoundError('Cannot obtain user id from data base!');

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.setVerified(true);
    user.setVerificationCode(discardVerificationCode); //verification code to invalidate future uses
    const updatedOk: boolean = await this.userService.updateById(userId, user);

    if (updatedOk === false) {
      console.log("Can not update email verified in data base for user:", user);
    }

    //Notificate to user
    let notificated: any;
    try {
      notificated = this.sendSuccessfulEmailConfirm(user.getFirstName(), user.getEmail(), lang);
    } catch (error) {
      //Could not be notified about confirmation of account 
      notificated = error;
    }

    //Successful response
    return { message: "Account confirmed!" };
  };

  /**
   * Send email to notificate successful confirmation
   * Send email with welcome message to end registration process.
   * @param 
   * @returns 
   */
  private async sendSuccessfulEmailConfirm(name: string, email: string, lang: string): Promise<any> {
    try {
      //set params to template
      const paramsRegisterEnd = { name: name, company: this.globalConfig.get<string>('COMPANY_NAME') };
      //Send email
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Registration successful`;

      const emailResponse: any = this.sender.sendEmailWithTemplate(subject, email, "register-end", paramsRegisterEnd, lang);
      return emailResponse;
    } catch (error) {
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, error);
    };
  };

  /**
   * logout
   * @param logoutFormDTO 
   * @returns 
   */
  async logout(logoutForm: LogoutForm): Promise<boolean> {
    const userAuthId: string = logoutForm.id;
    try {
      if (!userAuthId)
        throw new Error("Bad Request: Empty value!");
    } catch (error) {
      throw new DomainError(ErrorCode.BAD_REQUEST, error.message, error.message, { error: error });
    };
    return true;
  };


  /**
   * Send Email To Recovery Password
   * @param startRecoveryDataDTO 
   * @returns 
   */
  async sendEmailToRecoveryPass(startRecoveryData: StartRecoveryDataType, lang: string): Promise<any> {
    console.log("sendEmailToRecoveryPass lang:", lang);

    //validate input data
    if (!isEmailValid(startRecoveryData.email)) {
      throw new UserFormatError("Can not Send Email To Recovery Pass.: Invalid email!");
    }

    if (!startRecoveryData.recoveryPageLink || !isUrlValid(startRecoveryData.recoveryPageLink)) {
      throw new UserFormatError("Can not Send Email To Recovery Pass.: Invalid link!");
    }

    //generate verification code
    const newVerificationCode = generateToken();

    let user: User;
    //save verification code
    try {
      const query = { username: startRecoveryData.username };
      user = await this.userService.getByQuery(query);
      if (!user || user === null) throw new Error("User not found!");
    } catch (error) {
      throw new UserNotFoundError(error.message, error);
    };

    try {
      user.setVerificationCode(newVerificationCode);
      user.setStartVerificationCode(new Date());

      const userId: string | undefined = user.getId();
      if (userId === undefined) throw new UserNotFoundError('Cannot obtain user id from data base!');

      const updatedOk: boolean = await this.userService.updateById(userId, user);
      if (updatedOk === false) throw new Error("Can not save generated verification code!");

      //send email with link and verification code
      const token: string = encodeToken(startRecoveryData.email, newVerificationCode);
      const recoveryPageLink = createTokenLink(startRecoveryData.recoveryPageLink, token);

      //set params to email template
      const params = { recoverylink: recoveryPageLink, company: this.globalConfig.get<string>('COMPANY_NAME') };
      //send email
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Recover your password`;

      const emailResponse: any = await this.sender.sendEmailWithTemplate(subject, startRecoveryData.email, "recovery-start", params, lang);
      return {
        isSuccess: true,
        status: ErrorCode.OK,
        message: "Email was sent To Recovery Password!",
        data: emailResponse
      };
    } catch (error) {
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, error);
    };
  };

  /**
   * recoveryUpdatePassword
   * Require Admin token
   * @param recoveryUpdateDataDTO 
   * @returns 
   */
  async recoveryUpdatePassword(recoveryUpdateData: RecoveryUpdateDataType, lang: string): Promise<any> {

    let user: User;

    user = await this.verificateToken(recoveryUpdateData.token);

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordEncrypted: string = await bcrypt.hash(recoveryUpdateData.password, salt);

    const userId: string | undefined = user.getId();
    if (userId === undefined) throw new UserNotFoundError('Cannot obtain user id from data base!');

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.setVerificationCode(discardVerificationCode); //set verification code to invalidate future uses
    user.setPassword(newPasswordEncrypted);
    const updatedOk: boolean = await this.userService.updateById(userId, user);

    if (updatedOk === false) {
      console.log("Can not to reset verification code in data base for user:", user);
    }

    //Notificate to user
    try {
      this.sendSuccessfulRecoveryEmail(user.getFirstName(), user.getEmail(), lang);
    } catch (error) {
      //Could not be notified about changed password 
      console.log(error);
    }

    return { reseted: true };
  };

  /**
 * send email to notificate successful recovery
 * @param name 
 * @param email 
 * @returns 
 */
  private async sendSuccessfulRecoveryEmail(name: string, email: string, lang: string): Promise<any> {

    try {
      //set params to email template
      const params = { name: name, company: this.globalConfig.get<string>('COMPANY_NAME') };
      //Send email
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Password changed`;

      const emailResponse: any = this.sender.sendEmailWithTemplate(subject, email, "recovery-end", params, lang);
      return emailResponse;
    } catch (error) {
      throw error;
    };
  };

  /**
   * Verify that the token sent by user is the same as the one saved in the database,
   * for the user with the email encoded within the token.
   * @param token 
   * @returns 
   */
  private async verificateToken(token: string): Promise<User> {

    //Validate if token exist
    if (!token) {
      throw new InvalidVerificationCodeError("Invalid verification code token!");
    }

    const partsArray = decodeToken(token);
    const decodedEmail = partsArray[0];
    const decodedCode = partsArray[1];

    //Validate email
    if (!isEmailValid(decodedEmail)) {
      throw new InvalidVerificationCodeError("Invalid email!");
    }

    //Verificate code
    let user: User = await this.userService.getByQuery({
      userName: decodedEmail,
      verificationCode: decodedCode,
    });

    if (user == null) {
      throw new InvalidVerificationCodeError("Not found or verification code is wrong!");
    }

    //Validate if expired time
    const dateOfProcessStarted: Date = new Date(user.getStartVerificationCode());
    const expirationDaysLimit: number = this.globalConfig.get<number>('EXPIRATION_DAYS_LIMIT');

    if (this.isDateExpired(dateOfProcessStarted, expirationDaysLimit)) {
      throw new InvalidVerificationCodeError("Time has expired! Start the process again.");
    }

    return user;
  };

  /**
   * Validate if the number of days expired. Is the date expired?
   * Receive a date and calculate if the number of days until today exceeds the number of expiration deadlines (daysLimit)
   * @param date 
   * @param days 
   * @returns 
   */
  private isDateExpired(date: Date, daysLimit: number): boolean {
    const todate = new Date(); //Now time
    const difference_ms = todate.getTime() - date.getTime();
    const difference_days = Math.round(difference_ms / 86400000); //number of days until today
    return difference_days > daysLimit;
  };


};
