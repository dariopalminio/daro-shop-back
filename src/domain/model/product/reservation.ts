/**
 * Reservation Value Object
 * 
 * This shows when an order has any of this product in its items.
 * An order can reserve a product and commit part of its stock.
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class Reservation {
    orderId: string; //order confirmed in a customer purchase attempt
    quantity: number; //number of items reserved
    date: Date;
};