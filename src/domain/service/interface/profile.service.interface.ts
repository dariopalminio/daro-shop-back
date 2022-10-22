
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IProfile } from 'src/domain/model/profile/profile.interface';

/**
 * Profile Service Interface
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business/domain logic and validations are happening in the use of case classes such as services. This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IProfileService<T> extends IPersistentAggregateService<T> {
    getByUserName(userName: string): Promise<IProfile>;
    updateProfile(userProfileDTO: UserProfileDTO): Promise<boolean>;
};