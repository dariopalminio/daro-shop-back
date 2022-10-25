import { Reservation } from './reservation';
import { Sale } from './sale';
import { Entity } from '../entity';

/**
 * Product domain object (Entity root)
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
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
    updatedAt?: Date;
    createdAt?: Date;

    /**
    * Constructors
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(unmarshalled: any); 
    public constructor(id: string,
        sku: string, barcode: string, name: string, description: string, images: string[], category: string, type: string, brand: string,
        color: string, model: string, gender: string, size: string, netCost: number, ivaAmountOnCost: number, grossCost: number, netPrice: number,
        ivaAmountOnPrice: number, grossPrice: number, stock: number, active: boolean, updatedAt?: Date, createdAt?: Date);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 23) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 0) {
            super();
        }
        if (argumentsArray.length === 1) {
            super(argumentsArray[0]._id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]);
            this.setSku(argumentsArray[1]);
            this.setBarcode(argumentsArray[2]);
            this.setName(argumentsArray[3]);
            this.setDescription(argumentsArray[4]);
            this.setImages(argumentsArray[5]);
            this.setCategory(argumentsArray[6]);
            this.setType(argumentsArray[7]);
            this.setBrand(argumentsArray[8]);
            this.setColor(argumentsArray[9]);
            this.setModel(argumentsArray[10]);
            this.setGender(argumentsArray[11]);
            this.setSize(argumentsArray[12]);
            this.setNetCost(argumentsArray[13]);
            this.setIvaAmountOnCost(argumentsArray[14]);
            this.setGrossCost(argumentsArray[15]);
            this.setNetPrice(argumentsArray[16]);
            this.setIvaAmountOnPrice(argumentsArray[17]);
            this.setGrossPrice(argumentsArray[18]);
            this.setStock(argumentsArray[19]);
            this.setActive(argumentsArray[20]);
            this.reservations = [];
            this.sales = [];
            if (argumentsArray[21]) {
                this.updatedAt=(argumentsArray[21]);
            }
            if (argumentsArray[22]) {
                this.createdAt=(argumentsArray[22]);
            }
        }
    };

    /**
     * Set all attributes from Unmarshalled variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param prod Unmarshalled, any is used to tell TypeScript that a variable can be of any type such as DTO or json object
     */
    public setFromAny(unmarshalled: any) {
        this.setSku(unmarshalled.sku);
        this.setBarcode(unmarshalled.barcode);
        this.setName(unmarshalled.name);
        this.setDescription(unmarshalled.description);
        this.setImages(unmarshalled.images);
        this.setCategory(unmarshalled.category);
        this.setType(unmarshalled.type);
        this.setBrand(unmarshalled.brand);
        this.setColor(unmarshalled.color);
        this.setModel(unmarshalled.model);
        this.setGender(unmarshalled.gender);
        this.setSize(unmarshalled.size);
        this.setNetCost(unmarshalled.netCost);
        this.setIvaAmountOnCost(unmarshalled.ivaAmountOnCost);
        this.setGrossCost(unmarshalled.grossCost);
        this.setNetPrice(unmarshalled.netPrice);
        this.setIvaAmountOnPrice(unmarshalled.ivaAmountOnPrice);
        this.setGrossPrice(unmarshalled.grossPrice);
        this.setStock(unmarshalled.stock);
        if (unmarshalled.active)
            this.setActive(unmarshalled.active);
        else this.active = true;
        if (unmarshalled.reservations)
            this.setReservations(unmarshalled.reservations);
        else this.reservations = [];
        if (unmarshalled.sales)
            this.setSales(unmarshalled.sales);
        else this.sales = [];
        if (unmarshalled.updatedAt) {
            this.updatedAt=(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt=(unmarshalled.createdAt);
        }
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

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date))
        throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
    };

};


