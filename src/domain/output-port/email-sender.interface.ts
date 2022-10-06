
export default interface IEmailSender {
    sendEmail(subject: string, toEmail: string, htmlContent: string): Promise<any>;
    sendEmailFromOject(obj: any): Promise<any>;
    sendEmailWithTemplate(subject: string, toEmail: string, templateName: string, contexts: any, lang: string): Promise<any>;
    getTemplateAsHtmlString(templateName: string, params: any, locale: string): string;
  }