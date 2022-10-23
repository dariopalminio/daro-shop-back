import { IEntity } from "../entity.interface";

export interface IShippingPrice extends IEntity{

    location: string;
    price: number;
    money: string;
    description: string;
};
