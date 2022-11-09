
import { StartConfirmEmailData } from 'src/auth/domain/model/register/start-confirm-email-data';
import { StartRecoveryDataType } from 'src/auth/domain/model/recovery/start-recovery-data.type';
import { VerificationCodeDataType } from 'src/auth/domain/model/register/verification-code-data.type';
import { LogoutForm } from 'src/auth/domain/model/login/logout-form';
import { RecoveryUpdateDataType } from 'src/auth/domain/model/recovery/recovery-update-data.type';
import { RegisterForm } from 'src/auth/domain/model/register/register-form';

/**
 * Auth Tokens Interface
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business logic, validations are happening in the use of case classes such as services. This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IAuthService {

    register (userRegisterData: RegisterForm): Promise<any>;
    sendStartEmailConfirm(startConfirmEmailMessage: StartConfirmEmailData, lang:string): Promise<any>;
    confirmAccount(verificationCodeData: VerificationCodeDataType, lang:string): Promise<any>;
    logout(logoutForm: LogoutForm): Promise<boolean>;
    sendEmailToRecoveryPass(startRecoveryData: StartRecoveryDataType, lang:string): Promise<any>;
    recoveryUpdatePassword(recoveryUpdateData: RecoveryUpdateDataType, lang:string): Promise<any>;
    
};