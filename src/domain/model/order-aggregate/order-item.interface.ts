export interface IOrderItem {

    productId: string;
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    quantity: number;
    amount: number;

};
