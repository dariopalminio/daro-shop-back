import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from "hexa-three-levels";
import { Category } from '../domain/model/category.entity';
import { CategoryDocument } from './category.schema';
import { MongoGenericRepository } from "hexa-three-levels";
import { CategoryEntityFactory } from 'src/product/domain/model/category.entity';

/**
 * Category Mongo repository implementation
 * 
 * Note: This implementation works as an secondary adapter. 
 * There is an adapter layer that surrounds the application core. Adapters in this layer are not part of the core but interact with it.
 * The secondary adapters are called by the service (use cases). 
 */
@Injectable()
export class CategoryRepository extends MongoGenericRepository<CategoryDocument, Category> implements IRepository<Category> {

    constructor(
        @InjectModel('Category')
        categoryModel: Model<CategoryDocument>,
    ) { 
        super(categoryModel, new CategoryEntityFactory());
    }

}