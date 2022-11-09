import { Entity, IMarshable, IValidatable, convertAnyToDate } from "hexa-three-levels";
import { IPaymentMethod } from "./payment-method.interface";

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
export class PaymentMethod extends Entity implements IValidatable, IMarshable<PaymentMethod> {

    protected key: string;
    protected name: string;
    protected description: string;
    protected image: string;
    protected active: boolean;
    protected meta: any;
    protected updatedAt?: Date;
    protected createdAt?: Date;

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
        if (argumentsArray.length === 1) { //unmarshalled
            const id: string = argumentsArray[0]._id ? argumentsArray[0]._id.toString() : argumentsArray[0].id;
            super(id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            this.key = (argumentsArray[1]);
            this.name = (argumentsArray[21]);
            this.description = (argumentsArray[3]);
            this.image = (argumentsArray[4]);
            this.active = (argumentsArray[5]);
            this.meta = (argumentsArray[6]);
            if (argumentsArray[7]) {
                this.updatedAt = (argumentsArray[7]);
            }
            if (argumentsArray[8]) {
                this.createdAt = (argumentsArray[8]);
            }
        }
    };

    /**
     * Setting for Convert unmarshalled input to Domain Object Class
     * @param unmarshalled unmarshalled
     */
    private setFromAny(unmarshalled: any) {
        this.key = (unmarshalled.key);
        this.name = (unmarshalled.name);
        this.description = (unmarshalled.description);
        this.image = (unmarshalled.image);
        this.active = (unmarshalled.active);
        this.meta = (unmarshalled.meta);
        if (unmarshalled.updatedAt) {
            this.updatedAt = convertAnyToDate(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt = convertAnyToDate(unmarshalled.createdAt);
        }
    };

    
    public createFromAny(unmarshalled: any): PaymentMethod {
        return new PaymentMethod(unmarshalled);
    };

    /**
     * Unmarshal: convert class object to unmarshalled any
     */
    public convertToAny(): any {
        const unmarshalled: IPaymentMethod =  {
            id: this.id,
            key: this.key,
            name: this.name,
            description: this.description,
            image: this.image,
            active: this.active,
            meta: this.meta,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        };
        return unmarshalled;
    };

    public getKey(): string {
        return this.key;
    };

    public getName(): string {
        return this.name;
    };

    public getDescription(): string {
        return this.description;
    };

    public getImage(): string {
        return this.image;
    };

    public getActive(): boolean {
        return this.active;
    };

    public getMeta(): any {
        return this.meta;
    };

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    };

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    };

    public setKey(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field key has invalid format because is undefined or is not string!');
        }
        this.key = value;
    };
    public setName(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field name has invalid format because is undefined or is not string!');
        }
        this.name = value;
    };
    public setDescription(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field description has invalid format because is undefined or is not string!');
        }
        this.description = value;
    };
    public setImage(value: string) {
        if (value === undefined || (typeof value !== 'string')) {
            throw new Error('Field image has invalid format because is undefined or is not string!');
        }
        this.image = value;
    };

    public setActive(value: boolean) {
        if (value === undefined || typeof value !== "boolean") {
            throw new Error('Field active has invalid format because is undefined or is not boolean type!');
        }
        this.active = value;
    };

    public setMeta(value: any) {
        this.meta = value;
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date))
            throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
    };

    /**
    * Validate format throw Error if you do not meet any shippin price format requirement
    */
    public validateFormat() {
        this.validateName();
        this.validateDescription();
    };

    public validateName() {
        if (this.name === undefined || (typeof this.name !== 'string') || this.name.length === 0) {
            throw new Error('Field name in payment method has invalid format. The name field cannot be empty');
        }
    };

    public validateDescription() {
        if (this.description === undefined || (typeof this.description !== 'string') || this.description.length === 0) {
            throw new Error('Field description in payment method has invalid format. The description field cannot be empty');
        }
    };

};

