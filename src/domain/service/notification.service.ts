import { Injectable, Inject } from '@nestjs/common';
import { ContactMessage } from 'src/domain/model/notification/contact.message';
import { INotificationService } from 'src/domain/incoming/notification.service.interface';
import IEmailSender from 'src/domain/outgoing/email-sender.interface';
import { validEmail } from 'src/domain/helper/validators.helper';
import { DomainError, ErrorCode, IGlobalConfig } from "hexa-three-levels";

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
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,) {
  }

  /**
   * Send contact email 
   * @param contactMessage 
   * @returns 
   */
  async sendContactEmail(contactMessage: ContactMessage, locale: string): Promise<any> {

    if (!validEmail(contactMessage.email)) throw new Error("Invalid email!");

    try {
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Support`;
      const infoReturned: any = await this.sender.sendEmailWithTemplate(subject, contactMessage.email, "contact", contactMessage, locale);
      const resp: any = {
        isSuccess: true,
        status: ErrorCode.OK,
        message: "Email sent successful!",
        data: infoReturned
      };
      return resp;
    } catch (error) {
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, "Emal could not sent!", '', error);
    };
  };

  async sendEmail(subject: string, email: string, contentHTML: string): Promise<any> {

    if (!validEmail(email)) throw new Error("Invalid email!");

    try {
      const subject: string = `[${this.globalConfig.get<string>('COMPANY_NAME')}] Please verify your email`;
      const infoReturned: any = await this.sender.sendEmail(subject, email, contentHTML);
      const resp: any = {
        isSuccess: true,
        status: ErrorCode.OK,
        message: "Email sent successful!",
        data: infoReturned
      };
      return resp;
    } catch (error) {
      const resp: any = {
        isSuccess: false,
        status: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Emal could not sent!",
        data: {},
        error: error};
      return resp;
    };
  };

};
