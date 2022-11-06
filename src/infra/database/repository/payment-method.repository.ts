import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from "hexa-three-levels";
import { PaymentMethodDocument } from '../schema/payment-method.schema';
import { PaymentMethod } from 'src/domain/model/payment/payment-metod';
import { MongoGenericRepository } from "hexa-three-levels";
import { PaymentMethodEntityFactory } from 'src/domain/model/payment/payment-method.factory';


/**
 * PaymentMethod Mongo repository implementation
 */
 @Injectable()
 export class PaymentMethodRepository extends MongoGenericRepository<PaymentMethodDocument, PaymentMethod> implements IRepository<PaymentMethod> {
 
     constructor(
         @InjectModel('PaymentMethod')
         paymentMethodModel: Model<PaymentMethodDocument>,
     ) { 
         super(paymentMethodModel, new PaymentMethodEntityFactory());
     }
 
 };

