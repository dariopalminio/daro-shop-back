import { IProduct } from './product.interface';
import { ICategory } from '../category/category.interface';

export class Product implements IProduct {

    constructor(id: string,
        sku: string,
        barcode: string,
        name: string,
        description: string,
        images: string[],
        category: string,
        type: string,
        brand: string,
        color: string,
        model: string,
        gender: string,
        size: string,
        netCost: number,
        ivaAmountOnCost: number,
        grossCost: number,
        netPrice: number,
        ivaAmountOnPrice: number,
        grossPrice: number,
        stock: number,
        active:boolean) {

        this._id = id;
        this.sku = sku;
        this.barcode = barcode;
        this.name = name;
        this.description = description;
        this.images = images;
        this.category = category;
        this.type = type;
        this.brand = brand;
        this.color = color;
        this.model = model;
        this.gender = gender;
        this.size = size;
        this.netCost = netCost;
        this.ivaAmountOnCost = ivaAmountOnCost;
        this.grossCost = grossCost;
        this.netPrice = netPrice;
        this.ivaAmountOnPrice = ivaAmountOnPrice;
        this.grossPrice = grossPrice;
        this.stock = stock;
        this.active = active;
    };

    _id: string; //_id: holds an ObjectId.
    sku: string;
    barcode: string;
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
    netCost: number;
    ivaAmountOnCost: number;
    grossCost: number;
    netPrice: number;
    ivaAmountOnPrice: number;
    grossPrice: number;
    stock: number;
    active: boolean;
};


