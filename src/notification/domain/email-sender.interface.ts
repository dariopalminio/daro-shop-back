
/**
 * Email Sender Interface
 * 
 * Generic interface for your global congiguration.
 * The idea is that concrete implementation to send email cannot be accessed directly from the domain, but rather through an 'output port'.
 * 
 * Note: This interface works as output port. An output port (driven port) is another type of interface that is used by the application core 
 * to reach things outside of itself (like getting some data from file system or environment variables).
 */
export default interface IEmailSender {
    sendEmail(subject: string, toEmail: string, htmlContent: string): Promise<any>;
    sendEmailFromOject(obj: any): Promise<any>;
    sendEmailWithTemplate(subject: string, toEmail: string, templateName: string, contexts: any, lang: string): Promise<any>;
    getTemplateAsHtmlString(templateName: string, params: any, locale: string): string;
  }