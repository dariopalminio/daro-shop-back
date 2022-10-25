import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../infra-interface/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IShippingPriceService } from './interface/shipping-price.service.interface';
import { ShippingPrice } from '../model/shipping/shipping-price';
import { Address } from '../model/profile/address';

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
    return this.getByQuery({location: address.state});
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

  async create(shippingPriceRegisterDTO: ShippingPrice): Promise<ShippingPrice> {
    try {
      let newObj: ShippingPrice = new ShippingPrice();
      newObj.location = shippingPriceRegisterDTO.location;
      newObj.description = shippingPriceRegisterDTO.description;
      newObj.price = shippingPriceRegisterDTO.price;
      newObj.money = shippingPriceRegisterDTO.money;
      
      const entityNew: ShippingPrice = await this.shippingPriceRepository.create(newObj);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new DomainError(409, error.message, error);
        default:
          //Internal server error
          throw new DomainError(500, error.message, error);
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
