import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from 'src/domain/outgoing/repository.interface';
import { ICategoryService } from 'src/domain/incoming/category.service.interface';
import { Category } from 'src/domain/model/category/category';
import { ICategory } from '../model/category/category.interface';
import { CategoryEntityFactory } from '../model/category/category-entity.factory';
import { GenericService } from './generic.service';

/**
 * Category Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'Category' and Category collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces.
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class CategoryService extends GenericService<ICategory, Category> implements ICategoryService<Category> {

  constructor(
    @Inject('ICategoryRepository')
    categoryRepository: IRepository<Category>,
  ) { 
    super(categoryRepository, new CategoryEntityFactory());
  }

};
