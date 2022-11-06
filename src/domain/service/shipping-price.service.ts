import { Injectable, Inject } from '@nestjs/common';
import { IShippingPriceService } from 'src/domain/incoming/shipping-price.service.interface';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { Address } from 'src/domain/model/profile/address';
import { ShippingPriceDuplicateError, ShippingPriceFormatError, ShippingPriceNotFoundError } from '../error/shipping-price-errors';
import { IRepository, PaginatedResult, DomainError, ErrorCode } from "hexa-three-levels";

/**
 * Shipping Price Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'ShippingPrice' and ShippingPrices collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class ShippingPriceService implements IShippingPriceService<ShippingPrice> {
  constructor(
    @Inject('IShippingPriceRepository')
    private readonly shippingPriceRepository: IRepository<ShippingPrice>) {
  }
  
  findExcludingFields(query: any, fieldsToExclude: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  
  searchExcludingFields(queryFilter: any, fieldsToExclude: any, page: number, limit: number, orderByField: string, isAscending: boolean): Promise<PaginatedResult<any>> {
    throw new Error('Method not implemented.');
  }

  search(queryFilter?: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<PaginatedResult<ShippingPrice>> {
    throw new Error('Method not implemented.');
  };

  getPriceByAddress(address: Address): Promise<any> {
    console.log("getPriceByAddress");
    return this.getByQuery({location: address.getState()});
  }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ShippingPrice[]> {
    const list: ShippingPrice[] = await this.shippingPriceRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ShippingPrice[]> {
    const list: ShippingPrice[] = await this.shippingPriceRepository.find(query, page, limit, orderByField, isAscending);
    return list;
  };

  async getById(id: string): Promise<ShippingPrice> {
    const entity: ShippingPrice = await this.shippingPriceRepository.getById(id);
    if (!entity || entity === null) throw new ShippingPriceNotFoundError();
    return entity;
  };

  async create<IShippingPrice>(shippingPriceDTO: IShippingPrice): Promise<ShippingPrice> {
    let shippingPrice: ShippingPrice;
    try {
      shippingPrice = new ShippingPrice(shippingPriceDTO);
    } catch (error) {
      throw new ShippingPriceFormatError('ShippingPrice data malformed:' + error.message);
    }
    try {
      const entityNew: ShippingPrice = await this.shippingPriceRepository.create(shippingPrice);
      return entityNew;
    } catch (error) { 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new ShippingPriceDuplicateError(error.message, error);
        default:
          //Internal server error
          throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, error);
      }
    }
  };

  async delete(id: string): Promise<boolean> {
    const found: boolean = await this.shippingPriceRepository.hasById(id);
    if (!found) throw new ShippingPriceNotFoundError();
    const deleted: boolean = await this.shippingPriceRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, entity: ShippingPrice): Promise<boolean> {
    const found: boolean = await this.shippingPriceRepository.hasById(id);
    if (!found) throw new ShippingPriceNotFoundError();
    const updated: boolean = await this.shippingPriceRepository.updateById(id, entity);
    return updated;
  };

  async getByQuery(query: any): Promise<ShippingPrice> {
    const entity = await this.shippingPriceRepository.getByQuery(query);
    if (!entity || entity === null) throw new ShippingPriceNotFoundError();
    return entity;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updated: boolean = await this.shippingPriceRepository.update(query, valuesToSet);
    if (!updated) throw new ShippingPriceNotFoundError();
    return updated;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.shippingPriceRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.shippingPriceRepository.hasByQuery(query);
  };

};
