import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';
import { IPersistentAggregateService } from './persistent.aggregate.interface';



export interface ICategoryService<T> extends IPersistentAggregateService<T>{
 search(queryFilter: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<FilteredProductsDTO>
};

