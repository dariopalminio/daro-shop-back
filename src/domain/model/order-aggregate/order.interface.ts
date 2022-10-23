import { IEntity } from '../entity.interface';
import { Address } from '../profile/address';
import { Client } from './client';
import { IOrderItem } from './order-item.interface';

export interface IOrder extends IEntity{

    client: Client;
    
    orderItems: IOrderItem[];
    count: number;

    includesShipping: boolean; //if is false then includes pick up in store
    shippingAddress: Address;

    subTotal: number; //subotal with VAT included
    shippingPrice: number;
    total: number; //total with VAT included

    status: string;

    createdAt?: Date;
    updatedAt?: Date;
};

