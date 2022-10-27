import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from 'src/domain/incoming/auth.service.interface';
import { IUserService } from 'src/domain/incoming/user.service.interface';
import IEmailSender from 'src/domain/outgoing/email-sender.interface';
import { validEmail } from 'src/domain/helper/validators.helper';
import { generateToken, encodeToken, createTokenLink, decodeToken } from '../helper/token.helper';
import { StartConfirmEmailData } from 'src/domain/model/auth/register/start-confirm-email-data';
import { ParamsRegisterStart } from 'src/domain/model/auth/register/params-register-start';
import { StartRecoveryDataType } from 'src/domain/model/auth/recovery/start-recovery-data.type';
import { VerificationCodeDataType } from 'src/domain/model/auth/register/verification-code-data.type';
import { RecoveryUpdateDataType } from 'src/domain/model/auth/recovery/recovery-update-data.type';
import { LogoutForm } from 'src/domain/model/auth/login/logout-form';
import { ITranslator } from 'src/domain/outgoing/translator.interface';
import { ResponseCode } from 'src/domain/model/service/response.code.enum';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';;
import { DomainError } from 'src/domain/error/domain-error';
import { User } from 'src/domain/model/user/user';
import { IAuthTokensService } from 'src/domain/incoming/auth.tokens.service.interface';
import { PayloadType } from 'src/domain/model/auth/token/payload.type';
import { TokensType } from 'src/domain/model/auth/token/tokens.type';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { RegisterForm } from 'src/domain/model/auth/register/register-form';
const bcrypt = require('bcrypt');

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
    @Inject('ITranslator')
    private readonly i18n: ITranslator,
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
      //return res.status(400).json({error: 'Email ya registrado'})
      throw new DomainError(ResponseCode.BAD_REQUEST, 'Email ya registrado', { error: 'Email ya registrado' });
    }

    // Encrypt hash of password
    const salt = await bcrypt.genSalt(10);
    const passwordCrypted: string = await bcrypt.hash(userRegisterData.password, salt);

    // Create new user in user database
    let newObj: User = new User();
    newObj.setUserName(userRegisterData.email); //userName is email
    newObj.setFirstName(userRegisterData.firstName);
    newObj.setLastName(userRegisterData.lastName);
    newObj.setEmail(userRegisterData.email);
    newObj.setPassword(passwordCrypted);
    newObj.setRoles([RolesEnum.USER]);
    newObj.setVerified(false);
    newObj.setEnable(true);

    let userNew: User;
    try {
      userNew = await this.userService.create(newObj);
    } catch (error) {
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, { error: 'Error al registrar usuario' });
    }
    let userCreated: User;
    if (userNew) {
      try {
        userCreated = await this.userService.getUserJustRegister(userRegisterData.email);
      } catch (error) {
        console.log("Cannot retrieve created user in registration process!");
        return { message: 'Cannot obtain user from data base!' }
      }
      if (!userCreated)
        return { message: 'Cannot obtain user from data base!' }
    }

    const payload: PayloadType = {
      id: userCreated.getId(),
      typ: "Bearer",
      roles: userCreated.getRoles(),
      email_verified: userCreated.getVerified(),
      firstName: userCreated.getFirstName(),
      lastName: userCreated.getLastName(),
      userName: userCreated.getUserName(),
      email: userCreated.getEmail()
    };

    const tokens: TokensType = this.authTokensService.createTokens(payload, 86400, 86400 * 2);

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
    try {
      if (!validEmail(startConfirmEmailData.email))
        throw new Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));
      if (!startConfirmEmailData.verificationPageLink)
        throw new Error(await this.i18n.translate('auth.ERROR.INVALID_LINK',));
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, error);
    };

    let user;
    try {
      // Get user
      user = await this.userService.getByQuery({ userName: startConfirmEmailData.userName });
      if (!user) throw new Error(await this.i18n.translate('auth.ERROR.USER_NOT_FOUND',));
    } catch (error) {
      throw new DomainError(ResponseCode.NOT_FOUND, error.message, error);
    };

    try {
      // Generate new verification code
      const newVerificationCode = generateToken();
      user.verificationCode = newVerificationCode;

      const updatedOk: boolean = await this.userService.updateById(user._id, user);
      if (!updatedOk) throw new Error(await this.i18n.translate('auth.ERROR.CAN_NOT_SAVE_VERIFICATION_CODE',));

      const token: string = encodeToken(startConfirmEmailData.email, newVerificationCode);
      const verificationLink = createTokenLink(startConfirmEmailData.verificationPageLink, token);

      // Prepare params tu email template
      const paramsRegisterStart: ParamsRegisterStart = new ParamsRegisterStart();
      paramsRegisterStart.name = startConfirmEmailData.name;
      paramsRegisterStart.company = this.globalConfig.get<string>('COMPANY_NAME');
      paramsRegisterStart.link = verificationLink;
      const subject: string = await this.i18n.translate('auth.REGISTER_START_EMAIL.SUBJECT', { args: { company: paramsRegisterStart.company }, });

      //Send email
      const emailResponse: any = await this.sender.sendEmailWithTemplate(subject, startConfirmEmailData.email, "register-start", paramsRegisterStart, locale);
      return {
        isSuccess: true,
        status: ResponseCode.OK,
        message: await this.i18n.translate('auth.MESSAGE.SENT_VERIFICATION_EMAIL_SUCCESS',),
        data: emailResponse
      };

    } catch (error) {
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, error);
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

    let user: User = null;
    try {
      user = await this.verificateToken(verificationCodeData.token);
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, error);
    };

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.setVerified(true);
    user.setVerificationCode(discardVerificationCode); //verification code to invalidate future uses
    const updatedOk: boolean = await this.userService.updateById(user.getId(), user);

    if (!updatedOk) {
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
    const message = await this.i18n.translate('auth.MESSAGE.CONFIRM_WAS_SUCCESS',);
    return { message: message };
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
      const subject: string = await this.i18n.translate('auth.REGISTER_END_EMAIL.SUBJECT',
        { args: { company: this.globalConfig.get<string>('COMPANY_NAME') }, });
      const emailResponse: any = this.sender.sendEmailWithTemplate(subject, email, "register-end", paramsRegisterEnd, lang);
      return emailResponse;
    } catch (error) {
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, error);
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
        throw new Error(await this.i18n.translate('auth.ERROR.INVALID_EMPTY_VALUE',));
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, { error: error });
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
    try {
      if (!validEmail(startRecoveryData.email)) throw new Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));
      if (!startRecoveryData.recoveryPageLink) throw new Error(await this.i18n.translate('auth.ERROR.INVALID_LINK',));
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, "Can not Send Email To Recovery Pass.", error);
    };


    //generate verification code
    const newVerificationCode = generateToken();

    let user: User;
    //save verification code
    try {
      user = await this.userService.getByQuery({ userName: startRecoveryData.userName });
      if (!user) throw new Error("User not found!");
    } catch (error) {
      throw new DomainError(ResponseCode.NOT_FOUND, error.message, error);
    };

    try {
      user.setVerificationCode(newVerificationCode);
      user.setStartVerificationCode(new Date());

      const updatedOk: boolean = await this.userService.updateById(user.getId(), user);
      if (!updatedOk) throw new Error(await this.i18n.translate('auth.ERROR.COULD_NOT_SAVE_VERIFICATION_CODE',));

      //send email with link and verification code
      const token: string = encodeToken(startRecoveryData.email, newVerificationCode);
      const recoveryPageLink = createTokenLink(startRecoveryData.recoveryPageLink, token);

      //set params to email template
      const params = { recoverylink: recoveryPageLink, company: this.globalConfig.get<string>('COMPANY_NAME') };
      //send email
      const subject: string = await this.i18n.translate('auth.RECOVERY_START_EMAIL.SUBJECT',
        { args: { company: this.globalConfig.get<string>('COMPANY_NAME') }, });
      const emailResponse: any = await this.sender.sendEmailWithTemplate(subject, startRecoveryData.email, "recovery-start", params, lang);
      return {
        isSuccess: true,
        status: ResponseCode.OK,
        message: await this.i18n.translate('auth.MESSAGE.RECOVERY_EMAIL_SENT',),
        data: emailResponse
      };
    } catch (error) {
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, error);
    };
  };

  /**
   * recoveryUpdatePassword
   * Require Admin token
   * @param recoveryUpdateDataDTO 
   * @returns 
   */
  async recoveryUpdatePassword(recoveryUpdateData: RecoveryUpdateDataType, lang: string): Promise<any> {

    let user: User = null;

    try {
      user = await this.verificateToken(recoveryUpdateData.token);
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, "Token data undefined. Can not obtain token.", error);
    }

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordEncrypted: string = await bcrypt.hash(recoveryUpdateData.password, salt);

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.setVerificationCode(discardVerificationCode); //set verification code to invalidate future uses
    user.setPassword(newPasswordEncrypted);
    const updatedOk: boolean = await this.userService.updateById(user.getId(), user);

    if (!updatedOk) {
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
      const subject: string = await this.i18n.translate('auth.RECOVERY_END_EMAIL.SUBJECT',
        { args: { company: this.globalConfig.get<string>('COMPANY_NAME') }, });

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
      throw Error(await this.i18n.translate('auth.ERROR.INVALID_VERIFICATION_CODE_PARAM',));
    }

    const partsArray = decodeToken(token);
    const decodedEmail = partsArray[0];
    const decodedCode = partsArray[1];

    //Validate email
    if (!validEmail(decodedEmail)) {
      throw Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));
    }

    //Verificate code
    let user: User = await this.userService.getByQuery({
      userName: decodedEmail,
      verificationCode: decodedCode,
    });

    if (user == null) {
      throw Error(await this.i18n.translate('auth.ERROR.INVALID_VERIFICATION_CODE',));
    }

    //Validate if expired time
    const dateOfProcessStarted: Date = new Date(user.getStartVerificationCode());
    const expirationDaysLimit: number = this.globalConfig.get<number>('EXPIRATION_DAYS_LIMIT');

    if (this.isDateExpired(dateOfProcessStarted, expirationDaysLimit)) {
      throw Error(await this.i18n.translate('auth.ERROR.VERIFICATION_CODE_EXPIRED',));
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
