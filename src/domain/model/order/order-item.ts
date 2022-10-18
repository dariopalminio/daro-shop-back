import { IOrderItem } from './order-item.interface';

export class OrderItem implements IOrderItem {

    constructor(itemId: string, productId: string, imageURL: string, productName: string, grossPrice: number, quantity: number, itemAmount: number) {
        this.itemId = itemId;
        this.productId = productId;
        this.imageURL = imageURL;
        this.productName = productName;
        this.grossPrice = grossPrice;
        this.quantity = quantity;
        this.itemAmount = itemAmount;
    }

    itemId: string;
    productId: string; //_id: holds an ObjectId.
    imageURL: string;
    productName: string;
    grossPrice: number;
    quantity: number; 
    itemAmount: number;
};
