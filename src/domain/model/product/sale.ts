/**
 * Sale Value Object
 * 
 * This shows when an order complete and paid has any of this product in its items.
 * A paid order appears as a sale and decreases the stock of the product.
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class Sale {
    orderId: string; //order confirmed in a customer purchase attempt
    quantity: number; //number of items reserved
    grossPrice: number; //number of items reserved
    date: Date;
};