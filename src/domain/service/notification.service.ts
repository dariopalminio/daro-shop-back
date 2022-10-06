import { Injectable, Inject } from '@nestjs/common';
import { ContactMessage } from 'src/domain/model/notification/contact.message';
import { INotificationService } from '../service/interface/notification.service.interface';
import IEmailSender from '../output-port/email-sender.interface';
import { validEmail } from '../helper/validators.helper';
import { ITranslator } from 'src/domain/output-port/translator.interface';
import { ResponseCode } from 'src/domain/model/service/response.code.enum';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';
import { DomainError } from '../error/domain-error';

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
