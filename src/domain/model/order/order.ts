import { IOrder } from './order.interface';
import { IOrderItem } from './order-item.interface';
import { Address } from '../profile/address';
import { Client } from './client';
import { OrderStatus } from './order-status.enum';

export class Order implements IOrder {

    _id: string; //_id: holds an ObjectId.

    client: Client;
    
    orderItems: IOrderItem[];

    includesShipping: boolean; //if is false then includes pick up in store
    shippingAddress: Address;

    subTotal: number;
    shippingPrice: number;
    total: number;
    
    status: string;
    
    createdAt?: Date;
    updatedAt?: Date;
};