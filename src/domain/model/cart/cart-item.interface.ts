export interface ICartItem{
    productId: string; //_id: holds an ObjectId.
    productName: string;
    price: number;
    quantity: number; //{ type: String, required: true },
    itemAmount: number;
};
