import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { Category } from '../../../domain/model/category/category';
import { CategoryDocument } from '../schema/category.schema';
import { GenericRepository } from './generic-repository';
import { CategoryEntityFactory } from 'src/domain/model/category/category-entity.factory';

/**
 * Category Mongo repository implementation
 * 
 * Note: This implementation works as an secondary adapter. 
 * There is an adapter layer that surrounds the application core. Adapters in this layer are not part of the core but interact with it.
 * The secondary adapters are called by the service (use cases). 
 */
@Injectable()
export class CategoryRepository extends GenericRepository<CategoryDocument, Category> implements IRepository<Category> {

    constructor(
        @InjectModel('Category')
        categoryModel: Model<CategoryDocument>,
    ) { 
        super(categoryModel, new CategoryEntityFactory());
    }

}