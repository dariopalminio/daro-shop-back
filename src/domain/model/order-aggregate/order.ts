import { IOrder } from './order.interface';
import { IOrderItem } from './order-item.interface';
import { Address } from '../profile/address';
import { Client } from './client';
import { Entity } from '../entity';
import { OrderItem } from './order-item';

/**
 * Order domain object (Entity root)
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Order extends Entity implements IOrder {

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

    /**
     * Constructors
     * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(client: Client, orderItems: IOrderItem[], count: number, includesShipping: boolean, shippingAddress: Address, subTotal: number, shippingPrice: number, total: number);
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 8) throw new Error('Number of constructor arguments exceeded.');
        if (argumentsArray.length > 0) {
            let clientObject: Client = new Client();
            clientObject.setFromAny(argumentsArray[0]); //client
            this.client = clientObject;
            const hasAnArray: boolean = Array.isArray(argumentsArray[1]); //orderItems
            if (!hasAnArray) throw new Error('The order has no items. The field named orderItems is no an Array!');
            this.setOrderItemsFromAny(argumentsArray[1]); //orderItems
            if (isNaN(argumentsArray[2])) throw new Error('Casting error: quantity field is not a number!');
            this.count = argumentsArray[2]; //count
            this.includesShipping = argumentsArray[3]; //includesShipping
            let shippingAddress: Address = new Address();
            shippingAddress.setFromAny(argumentsArray[4]); //shippingAddress
            if (this.includesShipping) shippingAddress.validateFullAddress();
            this.shippingAddress = shippingAddress;
            this.subTotal = argumentsArray[5];
            this.shippingPrice = argumentsArray[6];
            this.total = argumentsArray[7];
        }
    };

    public setFromAny(orderPlain: any) {
        const hasAnArray: boolean = Array.isArray(orderPlain.orderItems);
        if (!hasAnArray) throw new Error('The order has no items. The field named orderItems is no an Array!');
        let clientObject: Client = new Client();
        clientObject.setFromAny(orderPlain.client);
        this.client = clientObject;
        this.includesShipping = orderPlain.includesShipping;
        let shippingAddress: Address = new Address();
        shippingAddress.setFromAny(orderPlain.shippingAddress);
        if (this.includesShipping) shippingAddress.validateFullAddress();
        this.shippingAddress = shippingAddress;
        this.subTotal = orderPlain.subTotal;
        this.shippingPrice = orderPlain.shippingPrice;
        this.total = orderPlain.total;
        this.setOrderItemsFromAny(orderPlain.orderItems);
        this.count = orderPlain.count;
        if (isNaN(orderPlain.count)) throw new Error('Casting error: quantity field is not a number!');
    };

    public setOrderItemsFromAny(items: Array<any>) {
        if (!items || items.length === 0) throw new Error('This order has no product items. An order must have at least one item.');
        let newItemsArray: IOrderItem[] = [];
        for (let i = 0; i < items.length; i++) {
            const orderItem: OrderItem = new OrderItem(items[i].productId, items[i].imageUrl, items[i].name, items[i].grossPrice, items[i].quantity, items[i].amount);
            newItemsArray.push(orderItem);
        }
        this.orderItems = newItemsArray;
    }

};


