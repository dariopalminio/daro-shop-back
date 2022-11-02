import { IEntityFactory } from "../entity-factory.interface";
import { ShippingPrice } from "./shipping-price";

export class ShippingPriceEntityFactory implements IEntityFactory<ShippingPrice> {
    createInstance(unmarshalled: any): ShippingPrice {
        return new ShippingPrice(unmarshalled);
    }
}