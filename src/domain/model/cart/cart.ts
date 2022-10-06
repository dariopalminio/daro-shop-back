import { ICart } from './cart.interface';
import { ICartItem } from './cart-item.interface';

export class Cart implements ICart {

    constructor(id: string, userId: string) {
        this._id = id;
        this.userId = userId;
        this.cartAmount = 0;
        this.status = "pending"; 
    }

    _id: string; //_id: holds an ObjectId.
    userId: string;
    cartItems: ICartItem[];
    cartAmount: number;
    status: string;
};

