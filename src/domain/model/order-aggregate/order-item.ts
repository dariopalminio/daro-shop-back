
/**
 * OrderItem Value Object
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class OrderItem {

    productId: string;
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    quantity: number; 
    amount: number;

    /**
     * Constructors
     * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
     */
    public constructor();
    public constructor(productId: string, imageUrl: string, name: string, grossPrice: number, quantity: number, amount: number);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 6) throw new Error('Number of constructor arguments exceeded.');
        if (argumentsArray.length > 0) {
            if (!argumentsArray[0] || (typeof argumentsArray[0] !== 'string') || argumentsArray[0].length === 0) throw new Error('Order item is invalid, because productId is undefined or empty.');
            if (!argumentsArray[4] || isNaN(argumentsArray[4]) || argumentsArray[4] <= 0) throw new Error('Order item is invalid, because quantity is wrong. Quantity must be a number greater than zero.');
            this.productId = argumentsArray[0];
            this.imageUrl = argumentsArray[1];
            this.name = argumentsArray[2];
            this.grossPrice = argumentsArray[4]? argumentsArray[3] : 0;
            this.quantity = argumentsArray[4];
            this.amount = argumentsArray[5]? argumentsArray[5] : 0;
        }
    };


};
