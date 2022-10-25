import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../infra-interface/repository.interface';
import { ICategoryService } from '../service/interface/category.service.interface';
import { PaginatedResult } from 'src/domain/model/paginated-result';
import { Category } from '../model/category/category';

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
export class CategoryService implements ICategoryService<Category> {

  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: IRepository<Category>,
  ) { }


  // Get all category
  async getAll(): Promise<Category[]> {
    const list: Category[] = await this.categoryRepository.getAll();
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Category[]>{
    const entity: Category[] = await this.categoryRepository.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  // Get a single category
  async getById(id: string): Promise<Category> {
    const category: Category = await this.categoryRepository.getById(id);
    return category;
  };

  async create(entity: Category): Promise<Category> {
    const entityNew: Promise<Category> = this.categoryRepository.create(entity);
    return entityNew;
  };

  // Delete category return this.labelModel.deleteOne({ osCode }).exec();
  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.categoryRepository.delete(id);
    return deleted;
  };

  // Put a single category
  async updateById(id: string, category: Category): Promise<boolean> {
    const updatedProduct: boolean = await this.categoryRepository.updateById(id, category);
    return updatedProduct;
  };

  async getByQuery(query: any): Promise<Category> {
    const cat =  await this.categoryRepository.getByQuery(query);
    return cat;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.categoryRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.categoryRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.categoryRepository.hasByQuery(query);
  };

  async search(queryFilter?: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaginatedResult> {
    const filter = queryFilter? queryFilter : {};
    const cats: Category[] = await this.categoryRepository.findExcludingFields(filter, {}, page, limit, orderByField, isAscending);
    let filtered: PaginatedResult = new PaginatedResult();
    filtered.list = cats;
    filtered.page = page;
    filtered.limit = limit;
    filtered.count = await this.categoryRepository.count(filter);
    return filtered;
  };

};
