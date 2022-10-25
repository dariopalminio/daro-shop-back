import { Entity } from "../entity";

/**
 * PaymentMethod domain object
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class PaymentMethod extends Entity {

    key: string;
    name: string;
    description: string;
    image: string;
    active: boolean;
    meta: any;
    createdAt?: Date;
    updatedAt?: Date;

    /**
     * Constructors 
     * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(payMethodAny: any); 
    public constructor(key: string, name: string, description: string, image: string, active: boolean, meta: any, updatedAt?: Date, createdAt?: Date);
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 8) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 1) {
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            this.key=(argumentsArray[0]);
            this.name=(argumentsArray[1]);
            this.description=(argumentsArray[2]);
            this.image=(argumentsArray[3]);
            this.active=(argumentsArray[4]);
            this.meta=(argumentsArray[5]);
            if (argumentsArray[6]) {
                this.updatedAt=(argumentsArray[6]);
            }
            if (argumentsArray[7]) {
                this.createdAt=(argumentsArray[7]);
            }
        }
    };

    public setFromAny(payMethodAny: any) {
        this.key=(payMethodAny.key);
        this.name=(payMethodAny.name);
        this.description=(payMethodAny.description);
        this.image=(payMethodAny.image);
        this.active=(payMethodAny.active);
        this.meta=(payMethodAny.meta);
        if (payMethodAny.updatedAt) {
            this.createdAt=(payMethodAny.updatedAt);
        }
        if (payMethodAny.createdAt) {
            this.createdAt=(payMethodAny.createdAt);
        }
    };

};

