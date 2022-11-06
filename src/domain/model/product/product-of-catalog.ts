import { IMarshable } from "hexa-three-levels";

/**
 * ProductOfCatalog Compound Value Object (Product Item for Catalog)
 *  
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class ProductOfCatalog implements IMarshable<ProductOfCatalog> {

    protected id: string;
    protected sku: string;
    protected name: string;
    protected description: string;
    protected images: string[];
    protected category: string;
    protected grossPrice: number;
    protected stock: number;

    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string,
        sku: string, name: string, description: string, images: string[], category: string,
        grossPrice: number, stock: number);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 8) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 1) { //Constructor to unmarshalled input
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            this.id = argumentsArray[0].toString();
            this.setSku(argumentsArray[1]);
            this.setName(argumentsArray[3]);
            this.setDescription(argumentsArray[4]);
            this.setImages(argumentsArray[5]);
            this.setCategory(argumentsArray[6]);
            this.setGrossPrice(argumentsArray[18]);
            this.setStock(argumentsArray[19]);
        }
    };

    private setFromAny(unmarshalled: any) {
        const id: string = unmarshalled._id ? unmarshalled._id.toString() : unmarshalled.id;
        this.id = id;
        this.sku = unmarshalled.sku;
        this.name = unmarshalled.name;
        this.description = unmarshalled.description;
        this.images = unmarshalled.images;
        this.category = unmarshalled.category;
        this.grossPrice = unmarshalled.grossPrice;
        this.stock = unmarshalled.stock;
    };

    public createFromAny(unmarshalled: any): ProductOfCatalog {
        return new ProductOfCatalog(unmarshalled);
    };

    public convertToAny(): any {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            description: this.description,
            images: this.images,
            category: this.category,
            grossPrice: this.grossPrice,
            stock: this.stock
        };
    };

    public getSku(): string {
        return this.sku;
    };

    public getName(): string {
        return this.name;
    };

    public getDescription(): string {
        return this.description;
    };

    public getImages(): string[] {
        return this.images;
    };

    public getCategory(): string {
        return this.category;
    };

    public getGrossPrice(): number {
        return this.grossPrice;
    };

    public getStock(): number {
        return this.stock;
    };

    public setSku(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field sku in product has invalid format because is undefined or is not string!');
        this.sku = value;
    };

    public setName(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field name  in product has invalid format because is undefined or is not string!');
        if (value.trim() === '') throw new Error('Field name has invalid because is empty string. A product must have a name!');
        this.name = value;
    };

    public setDescription(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field description in product has invalid format because is undefined or is not string!');
        this.description = value;
    };

    public setImages(value: string[]) {
        const isAnArray: boolean = Array.isArray(value); //required
        if (value === undefined || !isAnArray) throw new Error('Field images in product has invalid format because is not array and is required!');
        this.images = value;
    };

    public setCategory(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field category in product has invalid format because is undefined or is not string!');
        this.category = value;
    };

    public setGrossPrice(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field grossPrice in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.grossPrice = value;
    };

    public setStock(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field stock in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.stock = value;
    };
};
