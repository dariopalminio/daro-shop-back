import { Injectable, Inject } from '@nestjs/common';
import { ContactMessage } from 'src/domain/model/notification/contact.message';
import { INotificationService } from 'src/domain/incoming/notification.service.interface';
import IEmailSender from 'src/domain/outgoing/email-sender.interface';
import { validEmail } from 'src/domain/helper/validators.helper';
import { ITranslator } from 'src/domain/outgoing/translator.interface';
import { ResponseCode } from 'src/domain/model/service/response.code.enum';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { DomainError } from 'src/domain/error/domain-error';

/**
 * Notification Service
 * 
 * The service represents the main behavior associated with sendin messages or emails.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain objects or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject('IEmailSender')
    readonly sender: IEmailSender,
    @Inject('ITranslator')
    private readonly i18n: ITranslator,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,) {
  }

  /**
   * Send contact email 
   * @param contactMessage 
   * @returns 
   */
  async sendContactEmail(contactMessage: ContactMessage, locale: string): Promise<any> {

    if (!validEmail(contactMessage.email)) throw new Error(await this.i18n.translate('notification.ERROR.INVALID_EMAIL',));

    try {
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Support`;
      const infoReturned: any = await this.sender.sendEmailWithTemplate(subject, contactMessage.email, "contact", contactMessage, locale);
      const resp: any = {
        isSuccess: true,
        status: ResponseCode.OK,
        message: await this.i18n.translate('notification.MESSAGE.EMAIL_SENT_SUCCESS',),
        data: infoReturned
      };
      return resp;
    } catch (error) {
      const msg = await this.i18n.translate('notification.ERROR.EMAIL_COULD_NOT_SENT',);
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, msg, error);
    };
  };

  async sendEmail(subject: string, email: string, contentHTML: string): Promise<any> {

    if (!validEmail(email)) throw new Error("Invalid email!");

    try {
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Please verify your email`;
      const infoReturned: any = await this.sender.sendEmail(subject, email, contentHTML);
      const resp: any = {
        isSuccess: true,
        status: ResponseCode.OK,
        message: await this.i18n.translate('notification.MESSAGE.EMAIL_SENT_SUCCESS',),
        data: infoReturned
      };
      return resp;
    } catch (error) {
      const resp: any = {
        isSuccess: false,
        status: ResponseCode.INTERNAL_SERVER_ERROR,
        message: await this.i18n.translate('notification.ERROR.EMAIL_COULD_NOT_SENT',),
        data: {},
        error: error};
      return resp;
    };
  };

};
