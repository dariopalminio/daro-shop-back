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
    updatedAt?: Date;
    createdAt?: Date;

    /**
     * Constructors 
     * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(unmarshalled: any); 
    public constructor(id: string, 
        key: string, name: string, description: string, image: string, active: boolean, meta: any, updatedAt?: Date, createdAt?: Date);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 9) {
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
            this.key=(argumentsArray[1]);
            this.name=(argumentsArray[21]);
            this.description=(argumentsArray[3]);
            this.image=(argumentsArray[4]);
            this.active=(argumentsArray[5]);
            this.meta=(argumentsArray[6]);
            if (argumentsArray[7]) {
                this.updatedAt=(argumentsArray[7]);
            }
            if (argumentsArray[8]) {
                this.createdAt=(argumentsArray[8]);
            }
        }
    };

    public setFromAny(unmarshalled: any) {
        this.key=(unmarshalled.key);
        this.name=(unmarshalled.name);
        this.description=(unmarshalled.description);
        this.image=(unmarshalled.image);
        this.active=(unmarshalled.active);
        this.meta=(unmarshalled.meta);
        if (unmarshalled.updatedAt) {
            if (unmarshalled.updatedAt instanceof Date) {
                this.updatedAt = unmarshalled.updatedAt;
            } else {
                if (typeof unmarshalled.createdAt === "string") {
                    this.updatedAt = new Date(unmarshalled.updatedAt);
                }
            }
        }
        if (unmarshalled.createdAt) {
            if (unmarshalled.createdAt instanceof Date) {
                this.createdAt = unmarshalled.createdAt;
            } else {
                if (typeof unmarshalled.createdAt === "string") {
                    this.createdAt = new Date(unmarshalled.createdAt);
                }
            }
        }
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date))
        throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
    };

};

