
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IProfile } from 'src/domain/model/profile/profile.interface';
import { Address } from 'src/domain/model/profile/address';

export interface IShippingPriceService<T> extends IPersistentAggregateService<T> {
    getPriceByAddress(address: Address): Promise<any>;
};