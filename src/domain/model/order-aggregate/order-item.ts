import { Marshable } from "../marshable";

/**
 * OrderItem Value Object
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class OrderItem implements Marshable {

    protected productId: string;
    protected imageUrl: string;
    protected name: string;
    protected grossPrice: number; //Total price of sale with VAT included
    protected quantity: number;
    protected amount: number;

    /**
     * Constructors
     * TypeScript does not support the implementation of multiple constructors directly (constructor overloading). 
     * We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(unmarshalled: any);
    public constructor(productId: string, imageUrl: string, name: string, grossPrice: number, quantity: number, amount: number);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 6) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 1) { //Constructor to unmarshalled input
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            if (!argumentsArray[0] || (typeof argumentsArray[0] !== 'string') || argumentsArray[0].length === 0) throw new Error('Order item is invalid, because productId is undefined or empty.');
            if (!argumentsArray[4] || isNaN(argumentsArray[4]) || argumentsArray[4] <= 0) throw new Error('Order item is invalid, because quantity is wrong. Quantity must be a number greater than zero.');
            this.productId = argumentsArray[0];
            this.imageUrl = argumentsArray[1];
            this.name = argumentsArray[2];
            this.grossPrice = argumentsArray[4] ? argumentsArray[3] : 0;
            this.quantity = argumentsArray[4];
            this.amount = argumentsArray[5] ? argumentsArray[5] : 0;
        }
    };

    /**
    * Set all attributes from variable can be of any type 'any'.
    * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
    * @param unmarshalled any is used to tell TypeScript that a variable can be of any type such as DTO or json object
    */
    public setFromAny(unmarshalled: any) {
        this.setProductId(unmarshalled.productId);
        this.setImageUrl(unmarshalled.imageUrl);
        this.setName(unmarshalled.name);
        this.setGrossPrice(unmarshalled.grossPrice);
        this.setQuantity(unmarshalled.quantity);
        this.setAmount(unmarshalled.amount);
    };

    /**
     * Unmarshal: convert class object to unmarshalled any
     */
     public convertToAny(): any {
        return {
            productId: this.productId,
            imageUrl: this.imageUrl,
            name: this.name,
            grossPrice: this.grossPrice,
            quantity: this.quantity,
            amount: this.amount
        };
    };

    public getProductId(): string {
        return this.productId;
    };

    public getImageUrl(): string {
        return this.imageUrl;
    };

    public getName(): string {
        return this.name;
    };

    public getGrossPrice(): number {
        return this.grossPrice;
    };

    public getQuantity(): number {
        return this.quantity;
    };

    public getAmount(): number {
        return this.amount;
    };

    public setProductId(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field productId has invalid format because is undefined or is not string!');
        this.productId = value;
    };

    public setImageUrl(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field imageUrl has invalid format because is undefined or is not string!');
        this.imageUrl = value;
    };

    public setName(value: string) {
        this.name = value;
    };

    public setGrossPrice(value: number) {
        if (value === undefined)
            throw new Error('Field grossPrice has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field grossPrice has invalid format because is is not number type or is minor that zero!');
        this.grossPrice = value;
    };

    public setQuantity(value: number) {
        if (value === undefined)
            throw new Error('Field quantity has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field quantity has invalid format because is is not number type or is minor that zero!');
        this.quantity = value;
    };

    public setAmount(value: number) {
        if (value === undefined)
            throw new Error('Field amount has invalid format because is undefined or null!');
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field amount has invalid format because is is not number type or is minor that zero!');
        this.amount = value;
    };

};
