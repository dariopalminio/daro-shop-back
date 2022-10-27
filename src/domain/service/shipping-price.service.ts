import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from 'src/domain/outgoing/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IShippingPriceService } from 'src/domain/incoming/shipping-price.service.interface';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { Address } from 'src/domain/model/profile/address';
import { ResponseCode } from 'src/domain/error/response.code.enum';

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
    return entity;
  };

  async create(shippingPriceRegister: ShippingPrice): Promise<ShippingPrice> {
    try {
      const entityNew: ShippingPrice = await this.shippingPriceRepository.create(shippingPriceRegister);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new DomainError(ResponseCode.CONFLICT, error.message, error);
        default:
          //Internal server error
          throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, error);
      }
    }
  };

  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.shippingPriceRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, user: ShippingPrice): Promise<boolean> {
    const updated: boolean = await this.shippingPriceRepository.updateById(id, user);
    return updated;
  };

  async getByQuery(query: any): Promise<ShippingPrice> {
    const entity = await this.shippingPriceRepository.getByQuery(query);
    return entity;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updated: boolean = await this.shippingPriceRepository.update(query, valuesToSet);
    return updated;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.shippingPriceRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.shippingPriceRepository.hasByQuery(query);
  };

};
