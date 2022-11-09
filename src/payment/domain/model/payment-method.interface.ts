export interface IPaymentMethod {

    id?: string;
    key: string;
    name: string;
    description: string;
    image: string;
    active: boolean;
    meta: any;
    updatedAt?: Date;
    createdAt?: Date;

};