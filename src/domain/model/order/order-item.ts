import { IOrderItem } from './order-item.interface';

export class OrderItem implements IOrderItem {

    constructor(productId: string, imageUrl: string, name: string, grossPrice: number, quantity: number, amount: number) {
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.grossPrice = grossPrice;
        this.quantity = quantity;
        this.amount = amount;
    }

    productId: string;
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    quantity: number; 
    amount: number;
};
