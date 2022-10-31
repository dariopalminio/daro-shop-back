import { Reservation } from './reservation';
import { Entity } from '../entity';
import { throws } from 'assert';
import { convertAnyToDate } from 'src/domain/helper/date.helper';
import { Validatable } from '../validatable.interface';
import { Marshable } from '../marshable';

/**
 * Product domain object (Entity root)
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object (Entity) does not have any dependency on the other components except those of other atomic domain 
 * components part of model such as a 'Value Object'.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 */
export class Product extends Entity implements Validatable, Marshable {

    protected sku: string;
    protected barcode: string;
    protected name: string;
    protected description: string;
    protected images: string[];
    protected category: string;
    protected type: string;
    protected brand: string;
    protected color: string;
    protected model: string;
    protected gender: string;
    protected size: string;

    //purchase net price or amount of the purchase, before including VAT
    protected netCost: number;

    //IVA value of purchase or VAT amount on netCost (value added tax)
    protected ivaAmountOnCost: number;

    //gross value of purchase to provider
    protected grossCost: number;

    //netPrice price of sale or Net amount: It is the amount of the sale, before including VAT.
    //netPrice = (grossPrice * 100) / (100 + %IVA)
    protected netPrice: number;

    //IVA value of sale or VAT amount (value added tax): 
    //Corresponds to an additional X% based on the net amount. If the ticket is exempt, the value remains at $0.
    //ivaAmountOnPrice = ((netPrice * %IVA)/100)
    protected ivaAmountOnPrice: number;

    //Total amount with VAT included or gross Price: 
    //Equivalent to the sum of the totals (net, VAT and exempt) according to the type of document. It is the amount consumer paid.
    //gross price of sale, grossPrice = netPrice + ivaAmountOnPrice
    //grossPrice = netPrice + ((netPrice * %IVA)/100)
    //The prices in television commercials, catalogues, internet and in the straps of the gondolas 
    //is published with VAT included.
    protected grossPrice: number;

    protected stock: number;
    protected active: boolean;
    protected reservations: Reservation[];
    protected updatedAt?: Date;
    protected createdAt?: Date;

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
        if (argumentsArray.length === 1) { //Constructor to unmarshalled input
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
            if (argumentsArray[21]) {
                this.updatedAt = (argumentsArray[21]);
                console.log();
            }
            if (argumentsArray[22]) {
                this.createdAt = (argumentsArray[22]);
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
        this.setReservationsFromAny(unmarshalled);
        if (unmarshalled.active)
            this.setActive(unmarshalled.active);
        else this.active = true;
        if (unmarshalled.updatedAt) {
            this.updatedAt = convertAnyToDate(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt = convertAnyToDate(unmarshalled.createdAt);
        }
    };

    /**
    * Unmarshal: extract attributes from marshalled to any
    */
    public convertToAny(): any {
        return {
            _id: this._id,
            barcode: this.barcode,
            name: this.name,
            description: this.description,
            images: this.images,
            category: this.category,
            type: this.type,
            brand: this.brand,
            color: this.color,
            model: this.model,
            gender: this.gender,
            size: this.size,
            netCost: this.netCost,
            ivaAmountOnCost: this.ivaAmountOnCost,
            grossCost: this.grossCost,
            netPrice: this.netPrice,
            ivaAmountOnPrice: this.ivaAmountOnPrice,
            grossPrice: this.grossPrice,
            stock: this.stock,
            active: this.active,
            reservations: this.reservations.map((res) => (res.convertToAny())),
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        };
    };

    private setReservationsFromAny(unmarshalled: any) {
        if (unmarshalled.reservations) {
            const resList: Reservation[] = this.createReservationsEntityFromAny(unmarshalled.reservations);
            this.setReservations(resList);
        } else {
            this.reservations = [];
        }
    };

    /**
     * Convert Unmarshalled array ( any[]) to marshalled value object
     */
    private createReservationsEntityFromAny(unmarshalledArray: any[]): Reservation[] {
        let domainEntityArray: Reservation[] = [];
        unmarshalledArray.forEach(element => domainEntityArray.push(
            new Reservation(element)
        ));
        return domainEntityArray;
    };

    public getSku(): string {
        return this.sku;
    };

    public getBarcode(): string {
        return this.barcode;
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

    public getType(): string {
        return this.type;
    };

    public getBrand(): string {
        return this.brand;
    };

    public getColor(): string {
        return this.color;
    };

    public getModel(): string {
        return this.model;
    };

    public getGender(): string {
        return this.gender;
    };

    public getSize(): string {
        return this.size;
    };

    public getNetCost(): number {
        return this.netCost;
    };

    public getIvaAmountOnCost(): number {
        return this.ivaAmountOnCost;
    };

    public getGrossCost(): number {
        return this.grossCost;
    };

    public getNetPrice(): number {
        return this.netPrice;
    };

    public getIvaAmountOnPrice(): number {
        return this.ivaAmountOnPrice;
    };

    public getGrossPrice(): number {
        return this.grossPrice;
    };

    public getStock(): number {
        return this.stock;
    };

    public getActive(): boolean {
        return this.active;
    };

    public getUpdatedAt(): Date {
        return this.updatedAt;
    };

    public getCreatedAt(): Date {
        return this.createdAt;
    };

    public getReservations(): Reservation[] {
        return this.reservations;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setSku(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field sku in product has invalid format because is undefined or is not string!');
        this.sku = value;
    };

    public setBarcode(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field barcode in product has invalid format because is undefined or is not string!');
        this.barcode = value;
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

    public setType(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field type in product has invalid format because is undefined or is not string!');
        this.type = value;
    };

    public setBrand(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field brand in product has invalid format because is undefined or is not string!');
        this.brand = value;
    };

    public setColor(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field color in product has invalid format because is undefined or is not string!');
        this.color = value;
    };

    public setModel(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field model in product has invalid format because is undefined or is not string!');
        this.model = value;
    };

    public setGender(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field gender in product has invalid format because is undefined or is not string!');
        this.gender = value;
    };

    public setSize(value: string) {
        if (value === undefined || (typeof value !== 'string')) //required
            throw new Error('Field size in product has invalid format because is undefined or is not string!');
        this.size = value;
    };

    public setNetCost(value: number) {
        if (value === undefined || Number.isNaN(value)) //required
            throw new Error('Field netCost in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.netCost = value;
    };

    public setIvaAmountOnCost(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field ivaAmountOnCost in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.ivaAmountOnCost = value;
    };

    public setGrossCost(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field grossCost in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.grossCost = value;
    };

    public setNetPrice(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field netPrice in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.netPrice = value;
    };

    public setIvaAmountOnPrice(value: number) {
        if (value === undefined || isNaN(value)) //required
            throw new Error('Field ivaAmountOnPrice in product has invalid format because is undefined, is not number type or is minor that zero!');
        this.ivaAmountOnPrice = value;
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

    public setActive(value: boolean) {
        if (value === undefined || typeof value !== "boolean") //required
            throw new Error('Field active in product has invalid format because is undefined or is not boolean type!');
        this.active = value;
    };

    public setReservations(value: Reservation[]) {
        if (value === undefined) //required
            throw new Error('Field reservations in product has invalid format because is undefined!');
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field reservations has invalid format because is not array!');
        this.reservations = value;
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date)) //required
            throw new Error('Field updatedAt in product has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
    };

    public decreaseStock(quantity: number) {
        if (quantity > this.stock) throw new Error('Insufficient stock in product. Cannot be decremented.');
        this.stock -= quantity;
    };

    public increaseStock(quantity: number) {
        if (quantity < 0) throw new Error('The number to increase stock in product is not positive.');
        this.stock += quantity;
    };

    public addReservation(reserva: Reservation) {
        if (reserva.getQuantity() > this.stock) {
            throw new Error(`Insufficient stock in product. In orderId ${reserva.getOrderId()}` +
                `try to reserve quantity ${reserva.getQuantity()} when there is ${this.stock} in stock`);
        }
        this.stock -= reserva.getQuantity();
        this.reservations.push(reserva);
    };

    /**
     * Cancel reservation of orderId, rebook a reservation, and update the stock
     */
    public revertReservationAndUpdateStock(orderId: string) {
        //search reservation of orderId indicated
        const reserveIndex = this.reservations.findIndex((reservation) => reservation.getOrderId() === orderId);
        if (reserveIndex === -1) {
            throw new Error(`Not found ${orderId} in reservation list of product ${this._id}`);
        }
        //increase stock with reserve quantity
        const qty = this.reservations[reserveIndex].getQuantity();
        this.increaseStock(qty);
        //remove reservation from reservation list
        const newReservationList = [
            ...this.reservations.slice(0, reserveIndex),
            ...this.reservations.slice(reserveIndex + 1),
        ];
        this.reservations = newReservationList;
    };

    public removeReservation(orderId: string): boolean {
        //search the reservation
        const reserveIndex = this.reservations.findIndex((reservation) => reservation.getOrderId() === orderId);
        if (reserveIndex === -1) {
            return false;
        }
        const reservation: Reservation = this.reservations[reserveIndex];
        //delete the reservation from list
        const newReservationList = [
            ...this.reservations.slice(0, reserveIndex),
            ...this.reservations.slice(reserveIndex + 1),
        ];
        this.reservations = newReservationList;
        return true;
    };

    public getReservationByOrderId(orderId: string): Reservation | null {
        const reserveIndex = this.reservations.findIndex((reservation) => reservation.getOrderId() === orderId);
        if (reserveIndex === -1) {
            return null; //not found
        }
        return this.reservations[reserveIndex];
    };

    /**
     * Validate format throw Error if if you do not meet any product format requirement
     */
    public validateFormat() {
        this.validateSku();
        this.validateName();
        this.validateDescription();
    };

    public validateSku() {
        if (this.sku === undefined || (typeof this.sku !== 'string') || this.sku.length === 0) {
            throw new Error('Field sku in product has invalid format. SKU must have a maximum length of 12 units and cannot be empty');
        }
    };

    public validateName() {
        if (this.name === undefined || (typeof this.name !== 'string') || this.name.length === 0) {
            throw new Error('Field name in product has invalid format. The name field cannot be empty');
        }
    };

    public validateDescription() {
        if (this.description === undefined || (typeof this.description !== 'string') || this.description.length === 0) {
            throw new Error('Field description in product has invalid format. The description field cannot be empty');
        }
    };

};


