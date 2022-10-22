import { ICategory } from './category.interface';

/**
 * Category domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Category implements ICategory {

    constructor(id: string, name: string, description: string) {
        this._id = id;
        this.name = name;
        this.description = description;
    }

    _id: string; //_id: holds an ObjectId.
    name: string;
    description: string;
};