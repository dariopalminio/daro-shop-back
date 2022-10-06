import { ICartItem } from './cart-item.interface';

export class CartItem implements ICartItem {

    constructor(productId: string, productName: string, price: number, quantity: number, itemAmount: number) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.itemAmount = itemAmount;
    }

    productId: string; //_id: holds an ObjectId.
    productName: string;
    price: number;
    quantity: number; //{ type: String, required: true },
    itemAmount: number;
};
