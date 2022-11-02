import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { Order } from '../../../domain/model/order-aggregate/order';
import { OrderDocument } from '../schema/order.schema';
import { GenericRepository } from './generic-repository';
import { OrderEntityFactory } from 'src/domain/model/order-aggregate/order.factory';

/**
 * Order Mongo repository implementation
 */
 @Injectable()
 export class OrderRepository extends GenericRepository<OrderDocument, Order> implements IRepository<Order> {
 
     constructor(
         @InjectModel('Order')
         entityModel: Model<OrderDocument>,
     ) { 
         super(entityModel, new OrderEntityFactory());
     }
 
 };
 