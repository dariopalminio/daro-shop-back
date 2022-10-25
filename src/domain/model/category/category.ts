import { Entity } from '../entity';

/**
 * Category domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Category extends Entity {

    name: string;
    description: string;

    public constructor();
    public constructor(addrsAny: any); 
    public constructor(name: string, description: string);
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 2) {
            throw new Error('Number of constructor arguments exceeded');
        }
        if (argumentsArray.length === 1) {
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
        this.name = argumentsArray[0];
        this.description = argumentsArray[1];
        }
    };

    public setFromAny(addrsAny: any) {
        this.name = addrsAny.name;
        this.description = addrsAny.description;
    };

};