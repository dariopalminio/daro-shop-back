import { IAddress } from "./address.interface";

export class Address implements IAddress {
        street: string;
        department: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
    };