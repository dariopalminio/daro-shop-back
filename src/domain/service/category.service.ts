import { Injectable, Inject } from '@nestjs/common';
import { ICategory } from 'src/domain/model/category/category.interface';
import { CategoryDTO } from 'src/domain/model/category/category.dto';
import { IRepository } from '../output-port/repository.interface';
import { ICategoryService } from '../service/interface/category.service.interface';
import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';


@Injectable()
export class CategoryService implements ICategoryService<ICategory> {

  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: IRepository<ICategory>,
  ) { }


  // Get all category
  async getAll(): Promise<ICategory[]> {
    const list: ICategory[] = await this.categoryRepository.getAll();
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ICategory[]>{
    const entity: ICategory[] = await this.categoryRepository.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  // Get a single category
  async getById(id: string): Promise<ICategory> {
    const category: ICategory = await this.categoryRepository.getById(id);
    return category;
  };

  async create(categoryDTO: CategoryDTO): Promise<ICategory> {
    const entityNew: Promise<ICategory> = this.categoryRepository.create(categoryDTO);
    return entityNew;
  };

  // Delete category return this.labelModel.deleteOne({ osCode }).exec();
  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.categoryRepository.delete(id);
    return deleted;
  };

  // Put a single category
  async updateById(id: string, category: ICategory): Promise<boolean> {
    const updatedProduct: boolean = await this.categoryRepository.updateById(id, category);
    return updatedProduct;
  };

  async getByQuery(query: any): Promise<ICategory> {
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

  async search(queryFilter?: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<FilteredProductsDTO> {

    console.log("***********************************category search orderByField:", orderByField);
    console.log("***********************************category search isAscending:", isAscending);
    const filter = queryFilter? queryFilter : {};
    const cats: ICategory[] = await this.categoryRepository.findExcludingFields(filter, {}, page, limit, orderByField, isAscending);
    let filtered: FilteredProductsDTO = new FilteredProductsDTO();
    filtered.list = cats;
    filtered.page = page;
    filtered.limit = limit;
    filtered.count = await this.categoryRepository.count(filter);
    console.log("***********************************search:", cats);
    return filtered;
  };

};
