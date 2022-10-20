import { IOrder } from 'src/domain/model/order/order.interface';
import { IPersistentAggregateService } from './persistent.aggregate.interface';

export interface IOrderService<T> extends IPersistentAggregateService<T> {
   
    initialize(orderNew: IOrder): Promise<IOrder>;
    confirm(orderId: string): Promise<boolean>;
    abort(orderId: string): Promise<boolean>;
    completePayment(orderId: string): Promise<boolean>;
    
};