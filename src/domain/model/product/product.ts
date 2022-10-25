import { Reservation } from './reservation';
import { Sale } from './sale';
import { Entity } from '../entity';

/**
 * Product domain object (Entity root)
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 */
export class Product extends Entity {

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

    createdAt?: Date;
    updatedAt?: Date;

    /**
    * Constructors
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(productAny: any); 
    public constructor(sku: string, barcode: string, name: string, description: string, images: string[], category: string, type: string, brand: string,
        color: string, model: string, gender: string, size: string, netCost: number, ivaAmountOnCost: number, grossCost: number, netPrice: number,
        ivaAmountOnPrice: number, grossPrice: number, stock: number, active: boolean);
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 20) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 1) {
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            this.setSku(argumentsArray[0]);
            this.setBarcode(argumentsArray[1]);
            this.setName(argumentsArray[2]);
            this.setDescription(argumentsArray[3]);
            this.setImages(argumentsArray[4]);
            this.setCategory(argumentsArray[5]);
            this.setType(argumentsArray[6]);
            this.setBrand(argumentsArray[7]);
            this.setColor(argumentsArray[8]);
            this.setModel(argumentsArray[9]);
            this.setGender(argumentsArray[10]);
            this.setSize(argumentsArray[11]);
            this.setNetCost(argumentsArray[12]);
            this.setIvaAmountOnCost(argumentsArray[13]);
            this.setGrossCost(argumentsArray[14]);
            this.setNetPrice(argumentsArray[15]);
            this.setIvaAmountOnPrice(argumentsArray[16]);
            this.setGrossPrice(argumentsArray[17]);
            this.setStock(argumentsArray[18]);
            this.setActive(argumentsArray[19]);
            this.reservations = [];
            this.sales = [];
        }
    };

    /**
     * Set all attributes from variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param prod any is used to tell TypeScript that a variable can be of any type such as DTO or json object
     */
    public setFromAny(prod: any) {
        this.setSku(prod.sku);
        this.setBarcode(prod.barcode);
        this.setName(prod.name);
        this.setDescription(prod.description);
        this.setImages(prod.images);
        this.setCategory(prod.category);
        this.setType(prod.type);
        this.setBrand(prod.brand);
        this.setColor(prod.color);
        this.setModel(prod.model);
        this.setGender(prod.gender);
        this.setSize(prod.size);
        this.setNetCost(prod.netCost);
        this.setIvaAmountOnCost(prod.ivaAmountOnCost);
        this.setGrossCost(prod.grossCost);
        this.setNetPrice(prod.netPrice);
        this.setIvaAmountOnPrice(prod.ivaAmountOnPrice);
        this.setGrossPrice(prod.grossPrice);
        this.setStock(prod.stock);
        if (prod.active)
            this.setActive(prod.active);
        else this.active = true;
        if (prod.reservations)
            this.setReservations(prod.reservations);
        else this.reservations = [];
        if (prod.sales)
            this.setSales(prod.sales);
        else this.sales = [];
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setSku(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field sku has invalid format because is undefined or is not string!');
        this.sku = value;
    };

    public setBarcode(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field barcode has invalid format because is undefined or is not string!');
        this.barcode = value;
    };

    public setName(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field has invalid format because is undefined or is not string!');
        if (value.trim() === '') throw new Error('Field name has invalid because is empty string. A product must have a name!');
        this.name = value;
    };

    public setDescription(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field description has invalid format because is undefined or is not string!');
        this.description = value;
    };

    public setImages(value: string[]) {
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field images has invalid format because is not array!');
        this.images = value;
    };

    public setCategory(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field category has invalid format because is undefined or is not string!');
        this.category = value;
    };

    public setType(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field type has invalid format because is undefined or is not string!');
        this.type = value;
    };

    public setBrand(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field brand has invalid format because is undefined or is not string!');
        this.brand = value;
    };

    public setColor(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field color has invalid format because is undefined or is not string!');
        this.color = value;
    };

    public setModel(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field model has invalid format because is undefined or is not string!');
        this.model = value;
    };

    public setGender(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field gender has invalid format because is undefined or is not string!');
        this.gender = value;
    };

    public setSize(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field size has invalid format because is undefined or is not string!');
        this.size = value;
    };

    public setNetCost(value: number) {
        if (value === undefined || Number.isNaN(value) || value < 0)
            throw new Error('Field netCost has invalid format because is undefined, is not number type or is minor that zero!');
        this.netCost = value;
    };

    public setIvaAmountOnCost(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field ivaAmountOnCost has invalid format because is undefined, is not number type or is minor that zero!');
        this.ivaAmountOnCost = value;
    };

    public setGrossCost(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field grossCost has invalid format because is undefined, is not number type or is minor that zero!');
        this.grossCost = value;
    };

    public setNetPrice(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field netPrice has invalid format because is undefined, is not number type or is minor that zero!');
        this.netPrice = value;
    };

    public setIvaAmountOnPrice(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field ivaAmountOnPrice has invalid format because is undefined, is not number type or is minor that zero!');
        this.ivaAmountOnPrice = value;
    };

    public setGrossPrice(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field grossPrice has invalid format because is undefined, is not number type or is minor that zero!');
        this.grossPrice = value;
    };

    public setStock(value: number) {
        if (value === undefined || isNaN(value) || value < 0)
            throw new Error('Field stock has invalid format because is undefined, is not number type or is minor that zero!');
        this.stock = value;
    };

    public setActive(value: boolean) {
        if (value === undefined || typeof value !== "boolean")
            throw new Error('Field active has invalid format because is undefined or is not boolean type!');
        this.active = value;
    };

    public setReservations(value: Reservation[]) {
        if (value === undefined)
            throw new Error('Field reservations has invalid format because is undefined!');
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field reservations has invalid format because is not array!');
        this.reservations = value;
    };

    public setSales(value: Sale[]) {
        if (value === undefined)
            throw new Error('Field reservations has invalid format because is undefined!');
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field sales has invalid format because is not array!');
        this.sales = value;
    };

    public setUpdatedAt(value: Date) {
        if (value === undefined || !(value instanceof Date))
            throw this.updatedAt = new Date();
        else
            this.updatedAt = value;
    };

};


