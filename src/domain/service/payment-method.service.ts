import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { Address } from '../model/profile/address';
import { Order } from '../model/order/order';
import { IProductService } from './interface/product.service.interface';
import { IProduct } from '../model/product/product.interface';
import { IShippingPriceService } from './interface/shipping-price.service.interface';
import { IShippingPrice } from '../model/shipping/shipping-price.interface';
import { OrderItem } from '../model/order/order-item';
import { OrderStatus } from '../model/order/order-status.enum';
import { ResponseCode } from '../model/service/response.code.enum';
import { IPaymentMethodService } from './interface/payment-method.service.interface';
import { IPaymentMethod } from '../model/payment/payment-method.interface';
import { PaymentMethod } from '../model/payment/payment-metod';



@Injectable()
export class PaymentMethodService implements IPaymentMethodService<IPaymentMethod> {
  constructor(
    @Inject('IPaymentMethodRepository')
    private readonly paymentMethodRepo: IRepository<IPaymentMethod>,
  ) { }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IPaymentMethod[]> {
    const list: IPaymentMethod[] = await this.paymentMethodRepo.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IPaymentMethod[]> {
    const entity: IPaymentMethod[] = await this.paymentMethodRepo.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  async getById(id: string): Promise<IPaymentMethod> {
    const user: IPaymentMethod = await this.paymentMethodRepo.getById(id);
    return user;
  };

  async create(paymentMethod: IPaymentMethod): Promise<IPaymentMethod> {
    try {
      let newObj: PaymentMethod = new PaymentMethod();
      newObj.key = paymentMethod.key;
      newObj.name = paymentMethod.name;
      newObj.description = paymentMethod.description;
      newObj.image = paymentMethod.image;
      newObj.active = paymentMethod.active;
      newObj.meta = paymentMethod.meta;

      const entityNew: IPaymentMethod = await this.paymentMethodRepo.create(newObj);
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
    const deleted: boolean = await this.paymentMethodRepo.delete(id);
    return deleted;
  };

  async updateById(id: string, order: IPaymentMethod): Promise<boolean> {
    const updated: boolean = await this.paymentMethodRepo.updateById(id, { ...order, updatedAt: new Date() });
    return updated;
  };

  async getByUserName(userName: string): Promise<IPaymentMethod> {
    const query = { userName: userName };
    const user = await this.paymentMethodRepo.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IPaymentMethod> {
    const user = await this.paymentMethodRepo.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.paymentMethodRepo.update(query, { ...valuesToSet, updatedAt: new Date() });
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.paymentMethodRepo.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.paymentMethodRepo.hasByQuery(query);
  };

};
