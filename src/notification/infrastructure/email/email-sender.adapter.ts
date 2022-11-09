import { Injectable, Inject } from '@nestjs/common';
import IEmailSender from 'src/notification/domain/email-sender.interface';
import * as path from 'path';
import { IGlobalConfig } from "hexa-three-levels";

const fs = require("fs")
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")

/**
 * Email Smtp Sender implementation using nodemailer and handlebars
 */
@Injectable()
export class EmailSmtpSenderAdapter implements IEmailSender {

  smtpTransporter: any;
  templatePath: string;

  constructor(
    @Inject('IGlobalConfig')
    private readonly config: IGlobalConfig,
  ) {
    // Configuración transportador NodeMailer
    if (!this.config.get<string>('EMAIL_USER') ||
      !this.config.get<string>('EMAIL_PASS') ||
      !this.config.get<string>('EMAIL_HOST') ||
      !this.config.get<string>('EMAIL_PORT')
    ) throw Error("SmtpOptions param is empty!");

    this.templatePath = '../../../src/domain/emails/templates/';
    this.smtpTransporter = nodemailer.createTransport(this.getSmtpOptions());
  };

  /**
   * Get Smtp Options for send email using nodemailer.
   * @returns 
   */
  private getSmtpOptions() {
    if (!this.config.get<string>('EMAIL_USER') ||
    !this.config.get<string>('EMAIL_PASS') ||
    !this.config.get<string>('EMAIL_HOST') ||
    !this.config.get<string>('EMAIL_PORT')
  )
      throw Error("SmtpOptions param is empty!");
    return {
      host: this.config.get<string>('EMAIL_HOST'),
      port: this.config.get<string>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS')
      },
    };
  };

  /**
   * Send email using external email provider and Simple Mail Transfer Protocol.
   * 
   * @param subject 
   * @param toEmail 
   * @param contentHTML 
   * @returns sentInfo = {
  accepted: [ 'dachoy@stefanini.com' ],
  rejected: [],
  envelopeTime: 529,
  messageTime: 671,
  messageSize: 552,
  response: '250 2.0.0 OK  1624577213 c4sm3749797qkj.81 - gsmtp',
  envelope: { from: 'dariopalminio@gmail.com', to: [ 'dachoy@stefanini.com' ] },
  messageId: '<eb69f50e-caba-2c06-ce16-7b76e6cd9241@gmail.com>'
  }
   */
  async sendEmail(subject: string, toEmail: string, htmlContent: string): Promise<any> {

    try {

      const email = {
        from: this.config.get<string>('EMAIL_FROM'), // sender address,
        to: toEmail,
        subject: subject,
        html: htmlContent
      };

      //this.smtpTransporter = nodemailer.createTransport(this.getSmtpOptions());
      const sentInfo: any = await this.smtpTransporter.sendMail(email);
      console.log("sentInfo:");
      console.log(sentInfo);

      return sentInfo;
    } catch (error) {
      console.log("Nodemailer error!! Can not send email.");
      throw error;
    };
  };

  async sendEmailFromOject(obj: any): Promise<any> {
    try {
      return await this.smtpTransporter.sendMail(obj);
    } catch (error) {
      console.log("Nodemailer error!! Can not send email.");
      throw error;
    }
  };

  /**
   * Send email using template
   * Send emails from NodeJS applications using Nodemailer & Handlebars 
   * https://github.com/accimeesterlin/nodemailer-examples/tree/master/sendTemplates
   * 
   * @param subject 
   * @param toEmail addressee to send
   * @param templateName file name located in templates folder
   * @param params params to insterts in template
   * @param locale language
   */
  async sendEmailWithTemplate(subject: string, toEmail: string, templateName: string, params: any, locale: string): Promise<any> {
    try {
      const htmlToSend: string = this.getTemplateAsHtmlString(templateName, params, locale);

      let mailOptions = {
        from: this.config.get<string>('EMAIL_FROM'), // sender address,
        to: toEmail, // TODO: email receiver
        subject: subject,
        html: htmlToSend,
      };
      //this.smtpTransporter = nodemailer.createTransport(this.getSmtpOptions());
      const sentInfo: any = await this.smtpTransporter.sendMail(mailOptions);
      //console.log("sentInfo:", sentInfo);
      return sentInfo;
    } catch (error) {
      console.log("Nodemailer error!! Can not send email. ERROR: ", error);
      throw error;
    };
  };

  /**
   * Get template file and convert it to html string.
   * Handlebars to help with HTML templating of the email body. 
   * @param templateName file name located in templates folder
   * @param params params to insterts in template 
   * @param locale language
   * @returns 
   */
  getTemplateAsHtmlString(templateName: string, params: any, locale: string): string {
    const fileName = path.join(path.resolve(__dirname, this.templatePath + locale), `/${templateName}.hbs`);
    const emailTemplateSource = fs.readFileSync(fileName, "utf8");
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template(params);
    return htmlToSend;
  };

};

