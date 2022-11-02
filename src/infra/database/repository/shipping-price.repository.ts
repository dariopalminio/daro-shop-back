import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { ShippingPriceEntityFactory } from 'src/domain/model/shipping/shippingprice.factory';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { ShippingPriceDocument } from '../schema/shipping-price.schema';
import { GenericRepository } from './generic-repository';

@Injectable()
export class ShippingPriceRepository extends GenericRepository<ShippingPriceDocument, ShippingPrice> implements IRepository<ShippingPrice> {

    constructor(
        @InjectModel('ShippingPrice')
        shippingPriceModel: Model<ShippingPriceDocument>,
    ) { 
        super(shippingPriceModel, new ShippingPriceEntityFactory());
    }

}

