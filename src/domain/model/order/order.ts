import { IOrder } from './order.interface';
import { IOrderItem } from './order-item.interface';

export class Order implements IOrder {

    constructor(id: string, userId: string) {
        this._id = id;
        this.userId = userId;
        this.orderAmount = 0;
        this.status = "pending"; 
    }

    _id: string; //_id: holds an ObjectId.
    userId: string;
    orderItems: IOrderItem[];
    orderAmount: number;
    status: string;
};