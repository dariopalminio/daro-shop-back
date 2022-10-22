import { IProduct } from './product.interface';
import { ICategory } from '../category/category.interface';
import { Reservation } from './reservation';
import { Sale } from './sale';

/**
 * Product domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
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
        this.reservations = [];
        this.sales = [];
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
    reservations: Reservation[];
    sales: Sale[];
};


