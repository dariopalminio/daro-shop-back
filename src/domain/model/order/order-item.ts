import { IOrderItem } from './order-item.interface';

export class OrderItem implements IOrderItem {

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
