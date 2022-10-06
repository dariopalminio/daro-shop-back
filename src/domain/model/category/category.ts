import { ICategory } from './category.interface';

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