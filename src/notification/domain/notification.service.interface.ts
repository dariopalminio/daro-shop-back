import { ContactMessage } from 'src/notification/domain/model/contact.message';

/**
 * Notification Service Interface
 * 
 * Note: This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface INotificationService {
    sendContactEmail(contactMessage: ContactMessage, locale: string): Promise<any>;
    sendEmail(subject: string, email: string, contentHTML: string): Promise<any>;
  };