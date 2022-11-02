import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { PaymentMethodDocument } from '../schema/payment-method.schema';
import { PaymentMethod } from 'src/domain/model/payment/payment-metod';
import { GenericRepository } from './generic-repository';
import { PaymentMethodEntityFactory } from 'src/domain/model/payment/payment-method.factory';


/**
 * PaymentMethod Mongo repository implementation
 */
 @Injectable()
 export class PaymentMethodRepository extends GenericRepository<PaymentMethodDocument, PaymentMethod> implements IRepository<PaymentMethod> {
 
     constructor(
         @InjectModel('PaymentMethod')
         paymentMethodModel: Model<PaymentMethodDocument>,
     ) { 
         super(paymentMethodModel, new PaymentMethodEntityFactory());
     }
 
 };

