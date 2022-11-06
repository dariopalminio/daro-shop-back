import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { ShippingPriceEntityFactory } from 'src/domain/model/shipping/shippingprice.factory';
import { ShippingPriceDocument } from '../schema/shipping-price.schema';
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

