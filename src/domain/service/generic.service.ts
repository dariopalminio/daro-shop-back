import { IRepository } from 'src/domain/outgoing/repository.interface';
import { PaginatedResult } from 'src/domain/model/paginated-result';
import { DomainError, DuplicateError, FormatError, NotFoundError } from '../error/domain-error';
import { ErrorCode } from '../error/error-code.enum';
import { IEntityFactory } from '../model/entity-factory.interface';
import { IPersistentAggregateService } from './interface/persistent.aggregate.interface';

/**
 * Generic Service (PersistentAggregateService)
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'Category' and Category collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces.
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
export class GenericService<D, T> implements IPersistentAggregateService<T> {

    constructor(
        private readonly repository: IRepository<T>,
        private readonly factory: IEntityFactory<T>
    ) { }


    // Get all category
    async getAll(): Promise<T[]> {
        const list: T[] = await this.repository.getAll();
        return list;
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<T[]> {
        const entity: T[] = await this.repository.find(query, page, limit, orderByField, isAscending);
        return entity;
    };

    async getById(id: string): Promise<T> {
        const entity: T = await this.repository.getById(id);
        if (!entity || entity === null) throw new NotFoundError('The getById method found no results.');
        return entity;
    };

    async create<D>(categoryDTO: D): Promise<T> {
        let categoryEntity: T;
        try {
            categoryEntity = this.factory.createInstance(categoryDTO);
        } catch (error) {
            throw new FormatError('Data malformed: ' + error.message);
        }
        try {
            const entityNew: T = await this.repository.create(categoryEntity);
            return entityNew;
        } catch (error) {
            if (error.code && error.code === 11000) {
                throw new DuplicateError('The create method failed to persist entity', `Database error: Duplicate key error collection or index problem. ${error.message}`);
            }
            throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, '', error);
        }
    };

    async delete(id: string): Promise<boolean> {
        const found: boolean = await this.repository.hasById(id);
        if (!found) throw new NotFoundError('The delete method did not find the indicated entity.');
        const deleted: boolean = await this.repository.delete(id);
        return deleted;
    };

    async updateById<R>(id: string, entityDTO: R): Promise<boolean> {

        let entity: T;
        try {
            entity = this.factory.createInstance(entityDTO);
        } catch (error) {
          throw new FormatError('','Entity data malformed:' + error.message, error);
        }

        const found: boolean = await this.repository.hasById(id);
        if (!found) throw new NotFoundError('The updateById method did not find the indicated entity.');
        const updatedProduct: boolean = await this.repository.updateById(id, entity);
        return updatedProduct;
    };

    async getByQuery(query: any): Promise<T> {
        const entity: T = await this.repository.getByQuery(query);
        if (!entity || entity === null) throw new NotFoundError('The getByQuery method did not find the indicated entity.');
        return entity;
    };

    async update(query: any, valuesToSet: any): Promise<boolean> {
        const updatedProduct: boolean = await this.repository.update(query, valuesToSet);
        if (!updatedProduct) throw new NotFoundError('The update method did not find the indicated entity.');
        return updatedProduct;
    };

    async hasById(id: string): Promise<boolean> {
        return await this.repository.hasById(id);
    };

    async hasByQuery(query: any): Promise<boolean> {
        return await this.repository.hasByQuery(query);
    };

    async search(queryFilter?: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaginatedResult> {
        const filter = queryFilter ? queryFilter : {};
        const arrayLista: T[] = await this.repository.findExcludingFields(filter, {}, page, limit, orderByField, isAscending);
        let filtered: PaginatedResult = new PaginatedResult();
        const count = await this.repository.count(filter);
        filtered.list = arrayLista;
        filtered.page = page? page : 1;
        filtered.limit = limit? limit : count;
        filtered.count = count;
        return filtered;
    };

};
