export interface IOrderItem{
    itemId: string;
    productId: string; //_id: holds an ObjectId.
    imageURL: string;
    productName: string;
    grossPrice: number; //Total price of sale with VAT included
    quantity: number; 
    itemAmount: number;
};