import { Injectable, Inject } from '@nestjs/common';
import { ICategoryService } from 'src/product/domain/category.service.interface';
import { Category } from 'src/product/domain/model/category.entity';
import { ICategory } from './model/category.entity';
import { CategoryEntityFactory } from './model/category.entity';
import { IRepository, GenericService } from "hexa-three-levels";

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
