import { IAddress } from "./address.interface";

export class Address implements IAddress {

    public constructor(country?: string, state?: string, city?: string, neighborhood?: string, street?: string, department?: string) {
        this.country = country? country : '';
        this.state = state? state : '';
        this.city = city? city : '';
        this.neighborhood = neighborhood? neighborhood : '';
        this.street = street ? street : '';
        this.department = department? department : '';
    };


    country: string;
    state: string; //region
    city: string;
    neighborhood: string; //commune
    street: string;
    department: string;
};