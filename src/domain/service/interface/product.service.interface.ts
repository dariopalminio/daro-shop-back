import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IProduct } from 'src/domain/model/product/product.interface';
import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';

export interface IProductService<T> extends IPersistentAggregateService<T>{
    
    getAllActives(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProduct[]>;
    generateSKU(type: string, brand: string, model: string, color: string, size: string ): Promise<string>;
    getCatalog(category: string, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<FilteredProductsDTO>;
    getDetailById(id: string): Promise<IProduct>;
};


