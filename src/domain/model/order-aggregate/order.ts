import { Address } from '../profile/address';
import { Client } from './client';
import { Entity } from '../entity';
import { OrderItem } from './order-item';
import { convertAnyToDate } from 'src/domain/helper/date.helper';

/**
 * Order domain object (Entity root)
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Order extends Entity {

    client: Client;
    orderItems: OrderItem[];
    count: number;
    includesShipping: boolean; //if is false then includes pick up in store
    shippingAddress: Address;
    subTotal: number;
    shippingPrice: number;
    total: number;
    status: string;
    updatedAt?: Date;
    createdAt?: Date;

    /**
     * Constructors
     * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string,
        client: Client, orderItems: OrderItem[], count: number, includesShipping: boolean, shippingAddress: Address, subTotal: number, shippingPrice: number,
        total: number, updatedAt?: Date, createdAt?: Date);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 11) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 0) {
            super();
        }
        if (argumentsArray.length === 1) {
            super(argumentsArray[0]._id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            let clientObject: Client = new Client();
            clientObject.setFromAny(argumentsArray[1]); //client
            this.client = clientObject;
            const hasAnArray: boolean = Array.isArray(argumentsArray[2]); //orderItems
            if (!hasAnArray) throw new Error('The order has no items. The field named orderItems is no an Array!');
            this.setOrderItemsFromAny(argumentsArray[2]); //orderItems
            if (isNaN(argumentsArray[3])) throw new Error('Casting error: quantity field is not a number!');
            this.setCount(argumentsArray[3]); //count
            this.setIncludesShipping(argumentsArray[4]); //includesShipping
            let shippingAddress: Address = new Address(argumentsArray[5]);
            if (this.includesShipping) shippingAddress.validateFullAddress();
            this.setShippingAddress(shippingAddress);
            this.setSubTotal(argumentsArray[6]);
            this.setShippingPrice(argumentsArray[7]);
            this.setTotal(argumentsArray[8]);
            if (argumentsArray[9]) {
                this.updatedAt = (argumentsArray[9]);
            }
            if (argumentsArray[10]) {
                this.createdAt = (argumentsArray[10]);
            }
        }
    };

    /**
     * Set all attributes from variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param prod any is used to tell TypeScript that a variable can be of any type such as DTO or json object
     */
    public setFromAny(unmarshalled: any) {
        const hasAnArray: boolean = Array.isArray(unmarshalled.orderItems);
        if (!hasAnArray) throw new Error('The order has no items. The field named orderItems is no an Array!');
        let clientObject: Client = new Client();
        clientObject.setFromAny(unmarshalled.client);
        this.setClient(clientObject);
        this.setIncludesShipping(unmarshalled.includesShipping);
        let shippingAddress: Address = new Address();
        shippingAddress.setFromAny(unmarshalled.shippingAddress);
        if (this.includesShipping) shippingAddress.validateFullAddress();
        this.setShippingAddress(shippingAddress);
        this.setSubTotal(unmarshalled.subTotal);
        this.setShippingPrice(unmarshalled.shippingPrice);
        this.setTotal(unmarshalled.total);
        this.setOrderItemsFromAny(unmarshalled.orderItems);
        this.setCount(unmarshalled.count);
        if (isNaN(unmarshalled.count)) throw new Error('Casting error: quantity field is not a number!');
        if (unmarshalled.status) {
            this.setStatus(unmarshalled.status);
        }
        if (unmarshalled.updatedAt) {
            this.updatedAt = convertAnyToDate(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt = convertAnyToDate(unmarshalled.createdAt);
        }
    };

    private setOrderItemsFromAny(items: Array<any>) {
        if (items === undefined || items === null || (!Array.isArray(items)) || items.length === 0) {
            throw new Error('This order has no product items. An order must have at least one item.');
        }
        let newItemsArray: OrderItem[] = [];
        for (let i = 0; i < items.length; i++) {
            const orderItem: OrderItem = new OrderItem(items[i].productId, items[i].imageUrl, items[i].name, items[i].grossPrice, items[i].quantity, items[i].amount);
            newItemsArray.push(orderItem);
        }
        this.orderItems = newItemsArray;
    }

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setClient(value: Client) {
        if (value === undefined || value === null)
            throw new Error('Field client has invalid format because is undefined or null!');
        this.client = value;
    };

    public setOrderItems(value: OrderItem[]) {
        if (value === undefined || value === null)
            throw new Error('Field orderItems has invalid format because is undefined or null!');
        if (!Array.isArray(value)) {
            throw new Error('Field orderItems is not an array.');
        }
        this.orderItems = value;
    };

    public setCount(value: number) {
        if (value === undefined)
            throw new Error('Field count has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field count has invalid format because is is not number type or is minor that zero!');
        this.count = value;
    };

    public setIncludesShipping(value: boolean) {
        if (value === undefined)
            throw new Error('Field includesShipping has invalid format because is undefined or null!');
        if (typeof value !== "boolean")
            throw new Error('Field includesShipping has invalid format because is not boolean type!');
        this.includesShipping = value;
    };

    public setShippingAddress(value: Address) {
        if (value === undefined || value === null)
            throw new Error('Field shippingAddress has invalid format because is undefined or null!');
        this.shippingAddress = value;
    };

    public setSubTotal(value: number) {
        if (value === undefined)
            throw new Error('Field subTotal has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field subTotal has invalid format because is is not number type or is minor that zero!');
        this.subTotal = value;
    };

    public setShippingPrice(value: number) {
        if (value === undefined)
            throw new Error('Field shippingPrice has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field shippingPrice has invalid format because is is not number type or is minor that zero!');
        this.shippingPrice = value;
    };

    public setTotal(value: number) {
        if (value === undefined)
            throw new Error('Field total has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field total has invalid format because is is not number type or is minor that zero!');
        this.total = value;
    };

    public setStatus(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field status has invalid format because is undefined or is not string!');
        this.status = value;
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date))
            throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
    };

};


