import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { Profile } from '../model/profile/profile';
import { IShippingPriceService } from './interface/shipping-price.service.interface';
import { IShippingPrice } from '../model/shipping/shipping-price.interface';
import { ShippingPrice } from '../model/shipping/shipping-price';
import { Address } from '../model/profile/address';

@Injectable()
export class ShippingPriceService implements IShippingPriceService<IShippingPrice> {
  constructor(
    @Inject('IShippingPriceRepository')
    private readonly shippingPriceRepository: IRepository<IShippingPrice>) {
  }

  getPriceByAddress(address: Address): Promise<any> {
    return this.getByQuery({location: address.state});
  }

  // Get all
  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IShippingPrice[]> {
    const shipPrice: IShippingPrice[] = await this.shippingPriceRepository.getAll(page, limit, orderByField, isAscending);
    return shipPrice;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IShippingPrice[]> {
    const users: IShippingPrice[] = await this.shippingPriceRepository.find(query, page, limit, orderByField, isAscending);
    return users;
  };

  // Get a single
  async getById(id: string): Promise<IShippingPrice> {
    const user: IShippingPrice = await this.shippingPriceRepository.getById(id);
    return user;
  };

  //Create new user with basic data
  async create(shippingPriceRegisterDTO: IShippingPrice): Promise<boolean> {
    try {
      let newObj: IShippingPrice = new ShippingPrice();
      newObj.location = shippingPriceRegisterDTO.location;
      newObj.description = shippingPriceRegisterDTO.description;
      newObj.price = shippingPriceRegisterDTO.price;
      newObj.money = shippingPriceRegisterDTO.money;
      
      const newCat: boolean = await this.shippingPriceRepository.create(newObj);
      console.log(newCat);
      return newCat;
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

  // Delete user return this.labelModel.deleteOne({ osCode }).exec();
  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.shippingPriceRepository.delete(id);
    return deleted;
  };

  // Put a single user
  async updateById(id: string, user: IShippingPrice): Promise<boolean> {
    const updatedUser: boolean = await this.shippingPriceRepository.updateById(id, user);
    return updatedUser;
  };

  async getByUserName(userName: string): Promise<IShippingPrice> {
    const query = {userName: userName};
    const user = await this.shippingPriceRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IShippingPrice> {
    const user = await this.shippingPriceRepository.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.shippingPriceRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.shippingPriceRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.shippingPriceRepository.hasByQuery(query);
  };

};
