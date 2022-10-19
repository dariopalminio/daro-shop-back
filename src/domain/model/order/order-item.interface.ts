export interface IOrderItem{
    itemId: string;
    productId: string; //_id: holds an ObjectId.
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    qty: number; 
    amount: number;
};

