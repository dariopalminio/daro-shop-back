import { convertAnyToDate } from '../../helper/date.helper';
import { Marshable } from '../marshable';

/**
* Reservation Value Object
* 
* This shows when an order has any of this product in its items.
* An order can reserve a product and commit part of its stock.
* 
* Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
*/
export class Reservation implements Marshable {

    protected orderId: string; //order confirmed in a customer purchase attempt
    protected quantity: number; //number of items reserved
    protected date: Date;

    public constructor();
    public constructor(unmarshalled: any);
    public constructor(orderId: string, quantity: number, date: Date);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 3) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 1) {
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            this.orderId = argumentsArray[0];
            this.quantity = argumentsArray[1];
            this.date = argumentsArray[2];
        }
    };

    /**
     * Set all attributes from Unmarshalled variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO or Json, to the data type of this class.
     * @param unmarshalled Unmarshalled, any is used to tell TypeScript that a variable can be of any type such as DTO or json object
     */
    public setFromAny(unmarshalled: any) {
        this.setOrderId(unmarshalled.orderId);
        this.setQuantity(unmarshalled.quantity);
        this.date = convertAnyToDate(unmarshalled.date);
    };

    /**
    * Unmarshal: extract attributes from marshalled to any
    */
    public convertToAny(): any {
        return {
            orderId: this.orderId,
            quantity: this.quantity,
            date: this.date
        };
    };

    public getOrderId(): string {
        return this.orderId;
    };

    public getQuantity(): number {
        return this.quantity;
    };

    public getDate(): Date {
        return this.date;
    };

    public setOrderId(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field orderId has invalid format because is undefined or is not string!');
        this.orderId = value;
    };

    public setQuantity(value: number) {
        //a reserve is of a positive amount
        if (value === undefined || Number.isNaN(value) || value <= 0)
            throw new Error('Field quantity has invalid format because is undefined, is not number type or is minor or equal to zero!');
        this.quantity = value;
    };

    public setDate(date: Date) {
        if (date === undefined || !(date instanceof Date))
            throw new Error('Field date has invalid format because is undefined or is not Date!');
        this.date = date;
    };

};