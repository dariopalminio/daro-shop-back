import { IShippingPrice } from "./shipping-price.interface";


export class ShippingPrice implements IShippingPrice {
    _id: string;
    location: string;
    price: number;
    money: string;
    description: string;
};