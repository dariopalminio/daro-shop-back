import { ICategory } from '../category/category.interface';

export interface IProduct{
    _id: string; //_id: holds an ObjectId. { type: String, required: true, unique: true },
    sku:  string;
    barcode:  string;
    name: string;
    description: string;
    images: string[];
    category: string;
    type: string;
    brand: string;
    color: string;
    model: string;
    gender: string;
    size: string;

    //Purchase
    netCost: number; 
    ivaAmountOnCost: number;
    grossCost: number; 

    //Sale
    netPrice: number; 
    ivaAmountOnPrice: number;
    grossPrice: number; 

    //Inventory
    stock: number;
    active:boolean;  //is active to sell?
};

