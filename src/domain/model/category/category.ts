import { Entity } from '../entity';
import { IMarshable } from '../marshable.interface';
import { IValidatable } from '../validatable.interface';

/**
 * Category domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Category extends Entity implements IValidatable, IMarshable<Category> {

    protected name: string;
    protected description: string;

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
            const id: string = argumentsArray[0]._id ? argumentsArray[0]._id.toString() : argumentsArray[0].id;
            super(id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            this.name = argumentsArray[1];
            this.description = argumentsArray[2];
        }
    };

    private setFromAny(unmarshalled: any) {
        this.name = unmarshalled.name;
        this.description = unmarshalled.description;
    };

    createFromAny(unmarshalled: any): Category {
        return new Category(unmarshalled);
    };

    /**
     * Unmarshal: convert class object to unmarshalled any
     */
    public convertToAny(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        };
    };

    public validateFormat(): void {
        throw new Error('Method not implemented.');
    };

    public getName(): string {
        return this.name;
    };

    public getDescription(): string {
        return this.description;
    };

    public setName(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field name in category has invalid format because is undefined or is not string!');
        if (value.trim() === '') throw new Error('Field name has invalid because is empty string. A product must have a name!');
        this.name = value;
    };

    public setDescription(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field description in category has invalid format because is undefined or is not string!');
        this.description = value;
    };

};