import { Entity } from "../entity";
import { IShippingPrice } from "./shipping-price.interface";

/**
 * ShippingPrice domain object (Entity root)
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class ShippingPrice extends Entity implements IShippingPrice {

    location: string;
    price: number;
    money: string;
    description: string;
};