import { Entity } from '../entity';
import { Marshable } from '../marshable';
import { Validatable } from '../validatable.interface';

/**
 * Category domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Category extends Entity implements Validatable, Marshable {

    name: string;
    description: string;

    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string, name: string, description: string);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 3) {
            throw new Error('Number of constructor arguments exceeded');
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
            this.name = argumentsArray[1];
            this.description = argumentsArray[2];
        }
    };

    public setFromAny(unmarshalled: any) {
        this.name = unmarshalled.name;
        this.description = unmarshalled.description;
    };

    /**
     * Unmarshal: convert class object to unmarshalled any
     */
     public convertToAny(): any {
        return {
            _id: this._id,
            name: this.name,
            description: this.description
        };
    };

    public validateFormat(): void {
        throw new Error('Method not implemented.');
    }
    
};