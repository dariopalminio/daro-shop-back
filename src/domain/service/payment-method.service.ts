import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../infra-interface/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IPaymentMethodService } from './interface/payment-method.service.interface';
import { PaymentMethod } from '../model/payment/payment-metod';


/**
 * Payment Method Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'PaymentMethod' and PaymentMethods collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class PaymentMethodService implements IPaymentMethodService<PaymentMethod> {
  constructor(
    @Inject('IPaymentMethodRepository')
    private readonly paymentMethodRepo: IRepository<PaymentMethod>,
  ) { }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaymentMethod[]> {
    const list: PaymentMethod[] = await this.paymentMethodRepo.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaymentMethod[]> {
    const entity: PaymentMethod[] = await this.paymentMethodRepo.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  async getById(id: string): Promise<PaymentMethod> {
    const user: PaymentMethod = await this.paymentMethodRepo.getById(id);
    return user;
  };

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    try {
      const entityNew: PaymentMethod = await this.paymentMethodRepo.create(paymentMethod);
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

  async updateById(id: string, order: PaymentMethod): Promise<boolean> {
    const updated: boolean = await this.paymentMethodRepo.updateById(id, { ...order, updatedAt: new Date() });
    return updated;
  };

  async getByUserName(userName: string): Promise<PaymentMethod> {
    const query = { userName: userName };
    const user = await this.paymentMethodRepo.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<PaymentMethod> {
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
