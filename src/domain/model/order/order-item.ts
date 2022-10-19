import { IOrderItem } from './order-item.interface';

export class OrderItem implements IOrderItem {

    constructor(itemId: string, productId: string, imageUrl: string, name: string, grossPrice: number, qty: number, amount: number) {
        this.itemId = itemId;
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.grossPrice = grossPrice;
        this.qty = qty;
        this.amount = amount;
    }

    itemId: string;
    productId: string;
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    qty: number; 
    amount: number;
};
