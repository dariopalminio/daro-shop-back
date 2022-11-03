import { IReservation } from "./reservation.interface";

export interface IProduct {

    id?: string;
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
    reservations: IReservation[];
    updatedAt?: Date;
    createdAt?: Date;

}