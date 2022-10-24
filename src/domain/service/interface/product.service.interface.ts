import { IPersistentAggregateService } from './persistent.aggregate.interface';
import { IProduct } from 'src/domain/model/product/product.interface';
import { PaginatedResult } from 'src/domain/model/paginated-result';
import { Product } from 'src/domain/model/product/product';

/**
 * Product Service Interface
 * 
 * This is a Domain Service Interface that works with an Entity Root and its collection
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business/domain logic and validations are happening in the use of case classes such as services. 
 * This interface works as input port. An input port (driving port) lets the application core (Domain layer) 
 * to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IProductService<T> extends IPersistentAggregateService<T>{
    
    getAllActives(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProduct[]>;
    generateSKU(type: string, brand: string, model: string, color: string, size: string ): Promise<string>;
    getCatalog(category: string, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaginatedResult>;
    getDetailById(id: string): Promise<IProduct>;
    addStockReservation(productId: string, orderId: string, quantity: number): Promise<boolean>;
    revertStockReservation(productId: string, orderId: string): Promise<boolean>;
    moveReservationToSale(productId: string, orderId: string): Promise<boolean>;
    makeClassObjectFromAny(dto: any): Product;
};


