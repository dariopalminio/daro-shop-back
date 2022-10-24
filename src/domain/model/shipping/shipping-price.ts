import { Entity } from "../entity";

/**
 * ShippingPrice domain object (Entity root)
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class ShippingPrice extends Entity {

    location: string;
    price: number;
    money: string;
    description: string;

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(location: string, price: number, money: string, description: string
    );
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 11) throw new Error('Number of constructor arguments exceeded.');
        if (argumentsArray.length > 0) {
            this.setLocation(argumentsArray[0]);
            this.setPrice(argumentsArray[1]);
            this.setMoney(argumentsArray[2]);
            this.setDescription(argumentsArray[3]);
        }
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
        if (Number.isNaN(value) || value < 0)
            throw new Error('Field price has invalid format because is is not number type or is minor that zero!');
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

};