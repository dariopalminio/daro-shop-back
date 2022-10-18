import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from '../service/interface/auth.service.interface';
import { IAuth } from '../output-port/auth.interface';
import { UserRegisterDataDTO } from 'src/domain/model/auth/register/user-register-data.dto.type';
import { IUserService } from 'src/domain/service/interface/user.service.interface';
import { UserDTO } from 'src/domain/model/user/user-register.dto.type';
import IEmailSender from '../output-port/email-sender.interface';
import { validEmail } from '../helper/validators.helper';
import { generateToken, encodeToken, createTokenLink, decodeToken } from '../helper/token.helper';
import { StartConfirmEmailDataDTO } from 'src/domain/model/auth/register/start-confirm-email-data.dto';
import { ParamsRegisterStart } from 'src/domain/model/auth/register/params-register-start.type';
import { StartRecoveryDataDTO } from 'src/domain/model/auth/recovery/start-recovery-data.dto.type';
import { VerificationCodeDataDTO } from 'src/domain/model/auth/register/verification-code-data.dto.type';
import { RecoveryUpdateDataDTO } from 'src/domain/model/auth/recovery/recovery-update-data.dto.type';
import { LogoutFormDTO } from 'src/domain/model/auth/login/logout-form.dto';
import { IUser } from 'src/domain/model/user/user.interface';
import { ITranslator } from 'src/domain/output-port/translator.interface';
import { ResponseCode } from 'src/domain/model/service/response.code.enum';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { UserRegisterDataDTOValidator } from 'src/domain/validator/user-register-data-dto.validator';
import { DomainError } from 'src/domain/error/domain-error';
import { User } from '../model/user/user';
import { IAuthTokensService } from './interface/auth.tokens.service.interface';
import { PayloadType } from '../model/auth/token/payload.type';
import { TokensDTO } from '../model/auth/token/tokens.dto';
const bcrypt = require('bcrypt');

/**
 * Authorization service
 */
@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<IUser>,
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
  async register(userRegisterData: UserRegisterDataDTO): Promise<any> {

    console.log("userRegisterData:", userRegisterData);
    //Validate data
    console.log("Validate data");
    try {
      let validator = new UserRegisterDataDTOValidator();
      if (!validator.validate(userRegisterData)) {
        throw new Error(await validator.traslateValidateErrorsText(this.i18n));
      };
    } catch (error) {
      console.log("Validate data error:", error);
      // Error BadRequestException
      //return this.responseBadRequest(error);
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, { error: error.message });
    };

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
    const newUser: UserDTO = {
      userName: userRegisterData.email,
      firstName: userRegisterData.firstName,
      lastName: userRegisterData.lastName,
      email: userRegisterData.email,
      password: passwordCrypted,
      roles: ["User"]
    };

    let idNew: string;
    try {
      idNew = await this.userService.create(newUser);
    } catch (error) {
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, { error: 'Error al registrar usuario' });
    }
    let userCreated: IUser;
    if (idNew) {
      try {
        userCreated = await this.userService.getUserJustRegister(userRegisterData.email );
      } catch (error) {
        console.log("Cannot retrieve created user in registration process!");
        return { message: 'Cannot obtain user from data base!' }
      }
      if (!userCreated)
        return { message: 'Cannot obtain user from data base!' }
    }

    const payload: PayloadType = {
      id: userCreated._id,
      typ: "Bearer",
      roles: userCreated.roles,
      email_verified: userCreated.verified,
      firstName: userCreated.firstName,
      lastName: userCreated.lastName,
      userName: userCreated.userName,
      email: userCreated.email
    };

    const tokens: TokensDTO = this.authTokensService.createTokens(payload, 86400, 86400 * 2);
    
    return tokens;
  };

  /**
   * Send Start Email Confirm
   * Send an email-verification email to the user An email contains a link the user can click to verify their email address.
   * 
   * @param startConfirmEmailData 
   * @returns 
   */
  async sendStartEmailConfirm(startConfirmEmailData: StartConfirmEmailDataDTO, locale: string): Promise<any> {

    // Data validation
    try {
      if (!validEmail(startConfirmEmailData.email))
        throw new Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));
      if (!startConfirmEmailData.verificationPageLink)
        throw new Error(await this.i18n.translate('auth.ERROR.INVALID_LINK',));
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, error);
    };

    try {

      // Get user
      let user = await this.userService.getByQuery({ userName: startConfirmEmailData.userName });
      if (!user) throw new Error(await this.i18n.translate('auth.ERROR.USER_NOT_FOUND',));

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
  async confirmAccount(verificationCodeData: VerificationCodeDataDTO, lang: string): Promise<any> {

    let user: IUser = null;
    try {
      user = await this.verificateToken(verificationCodeData.token);
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, error);
    };

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.verified = true;
    user.verificationCode = discardVerificationCode; //verification code to invalidate future uses
    const updatedOk: boolean = await this.userService.updateById(user._id, user);

    if (!updatedOk) {
      console.log("Can not update email verified in data base for user:", user);
    }

    //Notificate to user
    let notificated: any;
    try {
      notificated = this.sendSuccessfulEmailConfirm(user.firstName, user.email, lang);
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
      throw error;
    };
  };

  /**
   * logout
   * @param logoutFormDTO 
   * @returns 
   */
  async logout(logoutFormDTO: LogoutFormDTO): Promise<boolean> {

    const userAuthId: string = logoutFormDTO.id;
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
  async sendEmailToRecoveryPass(startRecoveryDataDTO: StartRecoveryDataDTO, lang: string): Promise<any> {
    console.log("sendEmailToRecoveryPass lang:", lang);
    try {
      if (!validEmail(startRecoveryDataDTO.email)) throw new Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));
      if (!startRecoveryDataDTO.recoveryPageLink) throw new Error(await this.i18n.translate('auth.ERROR.INVALID_LINK',));
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, "Can not Send Email To Recovery Pass.", error);
    };

    try {
      //generate verification code
      const newVerificationCode = generateToken();

      //save verification code
      let user = await this.userService.getByQuery({ userName: startRecoveryDataDTO.userName });
      if (!user) throw new Error("User not found!");

      user.verificationCode = newVerificationCode;
      user.startVerificationCode = new Date();

      const updatedOk: boolean = await this.userService.updateById(user._id, user);
      if (!updatedOk) throw new Error(await this.i18n.translate('auth.ERROR.COULD_NOT_SAVE_VERIFICATION_CODE',));

      //send email with link and verification code
      const token: string = encodeToken(startRecoveryDataDTO.email, newVerificationCode);
      const recoveryPageLink = createTokenLink(startRecoveryDataDTO.recoveryPageLink, token);

      //set params to email template
      const params = { recoverylink: recoveryPageLink, company: this.globalConfig.get<string>('COMPANY_NAME') };
      //send email
      const subject: string = await this.i18n.translate('auth.RECOVERY_START_EMAIL.SUBJECT',
        { args: { company: this.globalConfig.get<string>('COMPANY_NAME') }, });
      const emailResponse: any = await this.sender.sendEmailWithTemplate(subject, startRecoveryDataDTO.email, "recovery-start", params, lang);
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
  async recoveryUpdatePassword(recoveryUpdateDataDTO: RecoveryUpdateDataDTO, lang: string): Promise<any> {

    let user: IUser = null;

    try {
      user = await this.verificateToken(recoveryUpdateDataDTO.token);
    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, "Token data undefined. Can not obtain token.", error);
    }

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordEncrypted: string = await bcrypt.hash(recoveryUpdateDataDTO.password, salt);

    //Update in database
    const discardVerificationCode = generateToken(); //generate verification code to invalidate future uses
    user.verificationCode = discardVerificationCode; //set verification code to invalidate future uses
    user.password = newPasswordEncrypted;
    const updatedOk: boolean = await this.userService.updateById(user._id, user);

    if (!updatedOk) {
      console.log("Can not to reset verification code in data base for user:", user);
    }

    //Notificate to user
    try {
      this.sendSuccessfulRecoveryEmail(user.firstName, user.email, lang);
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
  private async verificateToken(token: string): Promise<IUser> {

    //Validate if token exist
    if (!token) throw Error(await this.i18n.translate('auth.ERROR.INVALID_VERIFICATION_CODE_PARAM',));

    const partsArray = decodeToken(token);
    const decodedEmail = partsArray[0];
    const decodedCode = partsArray[1];

    //Validate email
    if (!validEmail(decodedEmail)) throw Error(await this.i18n.translate('auth.ERROR.INVALID_EMAIL',));

    //Verificate code
    let user: IUser = await this.userService.getByQuery({
      userName: decodedEmail,
      verificationCode: decodedCode,
    });

    if (user == null) {
      throw Error(await this.i18n.translate('auth.ERROR.INVALID_VERIFICATION_CODE',));
    }

    //Validate if expired time
    const dateOfProcessStarted: Date = new Date(user.startVerificationCode);
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
