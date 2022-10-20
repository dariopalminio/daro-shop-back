
export interface IPaymentMethod {
    _id?: string; //_id: holds an ObjectId.
    name: string;
    meta: any;
    createdAt?: Date;
    updatedAt?: Date;
};

