import { IOrder } from './order.interface';
import { IOrderItem } from './order-item.interface';
import { Address } from '../profile/address';
import { Client } from './client';

/**
 * Order domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Order implements IOrder {

    _id: string; //_id: holds an ObjectId.
    client: Client;
    orderItems: IOrderItem[];
    count: number;
    includesShipping: boolean; //if is false then includes pick up in store
    shippingAddress: Address;
    subTotal: number;
    shippingPrice: number;
    total: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
};


