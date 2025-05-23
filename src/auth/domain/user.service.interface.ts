
import { IPersistentAggregateService } from "hexa-three-levels";
import { User } from 'src/auth/domain/model/user/user';

/**
 * User Service Interface
 * 
 * This is a Domain Service Interface that works with an Entity Root and its collection.
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business/domain logic and validations are happening in the use of case classes such as services. This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IUserService<T> extends IPersistentAggregateService<T> {
    getByUsername(username: string): Promise<User>;
    getUserJustRegister(username: string): Promise<User>;
};