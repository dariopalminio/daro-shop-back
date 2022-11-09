import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingPrice } from 'src/shipping/domain/model/shipping-price';
import { ShippingPriceEntityFactory } from 'src/shipping/domain/model/shippingprice.factory';
import { ShippingPriceDocument } from './shipping-price.schema';
import { MongoGenericRepository } from "hexa-three-levels";
import { IRepository } from "hexa-three-levels";

@Injectable()
export class ShippingPriceRepository extends MongoGenericRepository<ShippingPriceDocument, ShippingPrice> implements IRepository<ShippingPrice> {

    constructor(
        @InjectModel('ShippingPrice')
        shippingPriceModel: Model<ShippingPriceDocument>,
    ) { 
        super(shippingPriceModel, new ShippingPriceEntityFactory());
    }

}

