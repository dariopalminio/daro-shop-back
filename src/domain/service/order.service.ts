import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { ShippingPrice } from '../model/shipping/shipping-price';
import { Address } from '../model/profile/address';
import { IOrderService } from './interface/order.service.interface';
import { IOrder } from '../model/order/order.interface';
import { Order } from '../model/order/order';

@Injectable()
export class OrderService implements IOrderService<IOrder> {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IRepository<IOrder>) {
  }

  getPriceByAddress(address: Address): Promise<any> {
    return this.getByQuery({location: address.state});
  }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
    const shipPrice: IOrder[] = await this.orderRepository.getAll(page, limit, orderByField, isAscending);
    return shipPrice;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
    const users: IOrder[] = await this.orderRepository.find(query, page, limit, orderByField, isAscending);
    return users;
  };

  async getById(id: string): Promise<IOrder> {
    const user: IOrder = await this.orderRepository.getById(id);
    return user;
  };

  async create(orderNew: IOrder): Promise<string> {
    try {
      console.log("Service->Create orderNew:",orderNew);
      let newObj: IOrder = new Order();
      newObj.client = orderNew.client;
      newObj.orderItems = orderNew.orderItems;
      newObj.includesShipping = orderNew.includesShipping;
      newObj.shippingAddress = orderNew.shippingAddress;
      newObj.subTotal = orderNew.subTotal;
      newObj.shippingPrice = orderNew.shippingPrice;
      newObj.total = orderNew.total;

      const idNew: string = await this.orderRepository.create(newObj);
      return idNew;
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
    const deleted: boolean = await this.orderRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, user: IOrder): Promise<boolean> {
    const updatedUser: boolean = await this.orderRepository.updateById(id, user);
    return updatedUser;
  };

  async getByUserName(userName: string): Promise<IOrder> {
    const query = {userName: userName};
    const user = await this.orderRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IOrder> {
    const user = await this.orderRepository.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.orderRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.orderRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.orderRepository.hasByQuery(query);
  };

};
