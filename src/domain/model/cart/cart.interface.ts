import { ICartItem } from './cart-item.interface';

export interface ICart{
    _id: string; //_id: holds an ObjectId.
    userId: string; //{ type: String, required: true },
    cartItems: ICartItem[]; 
    cartAmount: number;
    status: string; // { type: String, default: "pending", options: "ordered",  },
};

