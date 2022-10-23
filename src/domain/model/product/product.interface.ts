import { ICategory } from '../category/category.interface';
import { IEntity } from '../entity.interface';
import { Reservation } from './reservation';
import { Sale } from './sale';

export interface IProduct extends IEntity{
    
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

    reservations: Reservation[];
    sales: Sale[];
};

