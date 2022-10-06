
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IProfile } from 'src/domain/model/profile/profile.interface';

export interface IProfileService<T> extends IPersistentAggregateService<T> {
    getByUserName(userName: string): Promise<IProfile>;
    updateProfile(userProfileDTO: UserProfileDTO): Promise<boolean>;
};