import { ICategory } from './category.interface';

export class CategoryDTO implements ICategory{
    //_id: holds an ObjectId.
    _id: string; //_id: holds an ObjectId.
    readonly name: string;
    readonly description: string;
};