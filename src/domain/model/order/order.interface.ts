import { Address } from '../profile/address';
import { Client } from './client';
import { IOrderItem } from './order-item.interface';
import { OrderStatus } from './order-status.enum';

export interface IOrder {
    _id: string; //_id: holds an ObjectId.

    client: Client;
    
    orderItems: IOrderItem[];

    includesShipping: boolean; //if is false then includes pick up in store
    shippingAddress: Address;

    subTotal: number; //subotal with VAT included
    shippingPrice: number;
    total: number; //total with VAT included

    status: string;

    createdAt?: Date;
    updatedAt?: Date;
};

