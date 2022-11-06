import { Entity, IMarshable, IValidatable } from "hexa-three-levels";
import { IShippingPrice } from "./shipping-price.interface";

/**
 * ShippingPrice domain object (Entity root)
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class ShippingPrice extends Entity implements IValidatable, IMarshable<ShippingPrice> {

    protected location: string;
    protected price: number;
    protected money: string;
    protected description: string;

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string, location: string, price: number, money: string, description: string);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 5) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 0) {
            super();
        }
        if (argumentsArray.length === 1) { //Constructor to unmarshalled input
            const id: string = argumentsArray[0]._id ? argumentsArray[0]._id.toString() : argumentsArray[0].id;
            super(id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            this.setLocation(argumentsArray[1]);
            this.setPrice(argumentsArray[2]);
            this.setMoney(argumentsArray[3]);
            this.setDescription(argumentsArray[4]);
        }
    };

    /**
     * Marshal: Set all attributes from Unmarshalled variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param shippingPriceAny Unmarshalled, any is used to tell TypeScript that a variable can be of any type
     */
    private setFromAny(unmarshalled: any) {
        this.setLocation(unmarshalled.location);
        this.setPrice(unmarshalled.price);
        this.setMoney(unmarshalled.money);
        this.setDescription(unmarshalled.description);
    };

    public createFromAny(unmarshalled: any): ShippingPrice {
        return new ShippingPrice(unmarshalled);
    }

    /**
     * Unmarshal: extract attributes from marshalled to any
     */
    public convertToAny(): any {
        const unmarshalled: IShippingPrice = {
            id: this.id,
            location: this.location,
            price: this.price,
            money: this.money,
            description: this.description
        };
        return unmarshalled;
    };

    public setLocation(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field location has invalid format because is undefined or is not string!');
        }
        this.location = value;
    }

    public setPrice(value: number) {
        if (value === undefined)
            throw new Error('Field price has invalid format because is undefined or null!');
        if (Number.isNaN(value))
            throw new Error('Field price has invalid format because is is not number type!');
        this.price = value;
    };

    public setMoney(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field money has invalid format because is undefined or is not string!');
        }
        this.money = value;
    }

    public setDescription(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field description has invalid format because is undefined or is not string!');
        this.description = value;
    };

    public getLocation(): string {
        return this.location;
    };

    public getPrice(): number {
        return this.price;
    };
    public getMoney(): string {
        return this.money;
    };
    public getDescription(): string {
        return this.description;
    };

    /**
    * Validate format throw Error if you do not meet any shippin price format requirement
    */
    public validateFormat() {
        this.validateLocation();
        this.validatePrice();
        this.validateMoney();
        this.validateDescription();
    };

    public validateLocation() {
        if (this.location === undefined || (typeof this.location !== 'string')) {
            throw new Error('Field location has invalid format because is undefined or is not string!');
        }
    }

    public validatePrice() {
        if (this.price === undefined) {
            throw new Error('Field price has invalid format because is undefined or null!');
        }
        if (Number.isNaN(this.price) || this.price < 0) {
            throw new Error('Field price has invalid format because is is not number type or is minor that zero!');
        }

    };

    public validateMoney() {
        if (this.money === undefined || (typeof this.money !== 'string')) {
            throw new Error('Field money has invalid format because is undefined or is not string!');
        }
    }

    public validateDescription() {
        if (this.description === undefined || (typeof this.description !== 'string'))
            throw new Error('Field description has invalid format because is undefined or is not string!');
    };

};