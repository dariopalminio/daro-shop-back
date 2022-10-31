import { IAddress } from "../profile/address.interface";
import { IClient } from "./client.interface";
import { IOrderItem } from "./order-item.interface";

export interface IOrder {

     client: IClient;
     orderItems: IOrderItem[];
     count: number;
     includesShipping: boolean; //if is false then includes pick up in store
     shippingAddress: IAddress;
     subTotal: number;
     shippingPrice: number;
     total: number;
     status: string;
     updatedAt?: Date;
     createdAt?: Date;

}