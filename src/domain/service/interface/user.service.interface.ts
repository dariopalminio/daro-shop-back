
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IUser } from 'src/domain/model/user/user.interface';

export interface IUserService<T> extends IPersistentAggregateService<T> {
    getByUserName(userName: string): Promise<IUser>;
    getUserJustRegister(userName: string): Promise<IUser>;
};