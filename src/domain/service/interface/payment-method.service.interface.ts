import { IOrder } from 'src/domain/model/order/order.interface';
import { IPersistentAggregateService } from './persistent.aggregate.interface';

export interface IPaymentMethodService<T> extends IPersistentAggregateService<T> {
    
};