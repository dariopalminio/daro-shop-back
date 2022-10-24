import { Entity } from '../entity';
import { ICategory } from './category.interface';

/**
 * Category domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Category extends Entity implements ICategory {

    name: string;
    description: string;

    public constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    };

};