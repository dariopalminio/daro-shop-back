import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from "hexa-three-levels";
import { Order } from '../domain/model/order';
import { OrderDocument } from './order.schema';
import { MongoGenericRepository } from "hexa-three-levels";
import { OrderEntityFactory } from 'src/order/domain/model/order.factory';

/**
 * Order Mongo repository implementation
 */
 @Injectable()
 export class OrderRepository extends MongoGenericRepository<OrderDocument, Order> implements IRepository<Order> {
 
     constructor(
         @InjectModel('Order')
         entityModel: Model<OrderDocument>,
     ) { 
         super(entityModel, new OrderEntityFactory());
     }
 
 };
 