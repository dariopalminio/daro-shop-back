export interface IOrderItem{
    productId: string; //_id: holds an ObjectId.
    imageUrl: string;
    name: string;
    grossPrice: number; //Total price of sale with VAT included
    quantity: number; 
    amount: number;
};

