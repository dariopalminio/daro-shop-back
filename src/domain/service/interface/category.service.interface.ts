import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';
import { IPersistentAggregateService } from './persistent.aggregate.interface';

/**
 * Category Service Interface
 * 
 * Note: This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface ICategoryService<T> extends IPersistentAggregateService<T>{
 search(queryFilter: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<FilteredProductsDTO>
};

