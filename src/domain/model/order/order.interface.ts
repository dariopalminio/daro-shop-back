import { IOrderItem } from './order-item.interface';

export interface IOrder{
    _id: string; //_id: holds an ObjectId.
    userId: string; //{ type: String, required: true },
    orderItems: IOrderItem[]; 
    orderAmount: number;
    //address: { type: Object, required: true },
    status: string; //status: { type: String, default: "pending", options: "paidout" },
};




