import { IEntity } from "../entity.interface";

export interface IPaymentMethod extends IEntity {

    key: string;
    name: string;
    description: string;
    image: string;
    active: boolean;
    meta: any;
    createdAt?: Date;
    updatedAt?: Date;
};

