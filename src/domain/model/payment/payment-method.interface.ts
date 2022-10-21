
export interface IPaymentMethod {
    _id?: string; //_id: holds an ObjectId.
    key: string;
    name: string;
    description: string;
    image: string;
    active: boolean;
    meta: any;
    createdAt?: Date;
    updatedAt?: Date;
};

