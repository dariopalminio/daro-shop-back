import { IAddress } from "./address.interface";

/**
 * Address Value Object
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class Address implements IAddress {

    country: string;
    state: string; //region
    city: string;
    neighborhood: string; //commune
    street: string;
    department: string;

    public constructor();
    public constructor(country: string, state: string, city: string, neighborhood: string, street: string, department: string);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 5) throw new Error('Number of constructor arguments exceeded (country, state, city, neighborhood, street, department)');
        if (argumentsArray.length > 0) {
            this.setCountry(argumentsArray[0]); //country
            this.setState(argumentsArray[1]); //state
            this.setCity(argumentsArray[2]); //city
            this.setNeighborhood(argumentsArray[3]); //neighborhood
            this.setStreet(argumentsArray[4]); //street
            this.setDepartment(argumentsArray[5]); //department
        }
    };

    public setFromAny(addrsAny: any) {
        if (addrsAny === undefined || addrsAny === null)
            throw new Error('Address is invalid (undefined or null)!');
        if (!addrsAny.country || !addrsAny.state || !addrsAny.city || !addrsAny.neighborhood || !addrsAny.street || !addrsAny.department)
            throw new Error('Address has some invalid field!');
        this.setCountry(addrsAny.country);
        this.setState(addrsAny.state);
        this.setCity(addrsAny.city);
        this.setNeighborhood(addrsAny.neighborhood);
        this.setStreet(addrsAny.street);
        this.setDepartment(addrsAny.department);
    };

    public setCountry(country: string) {
        this.country = country;
    }

    public setCity(city: string) {
        this.city = city ? city : '';
    }

    public setState(state: string) {
        this.state = state ? state : '';
    }

    public setNeighborhood(neighborhood: string) {
        this.neighborhood = neighborhood ? neighborhood : '';
    }

    public setStreet(street: string) {
        this.street = street ? street : '';
    }

    public setDepartment(dept: string) {
        this.department = dept ? dept : '';
    }

    public validateCountry() {
        if (this.country === undefined || this.country.length === 0) throw new Error('Field country has invalid format because is undefined or empty!');
        const regularExpresion = /^[a-zA-ZÀ-ÿ\s]{1,40}$/; // Letters and spaces can carry accents.
        const isValid: boolean = regularExpresion.test(this.country);
        if (!isValid) throw new Error('Field country has invalid format, because the country must contain letters!');
    }

    public validateCity() {
        if (this.city === undefined || this.city.length === 0) throw new Error('Field city has invalid format because is undefined or empty!');
    }

    public validateState() {
        if (this.state === undefined || this.state.length === 0) throw new Error('Field state has invalid format because is undefined or empty!');
    }

    public validateNeighborhood() {
        if (this.neighborhood === undefined || this.neighborhood.length === 0) throw new Error('Field neighborhood has invalid format because is undefined or empty!');
    }

    public validateStreet() {
        if (this.street === undefined || this.street.length === 0) throw new Error('Field street has invalid format because is undefined or empty!');
        const regularExpresion = /^[0-9a-zA-Z\s]*$/; // String Contains Only Letters, Spaces, numbers and is not Empty 
        const isValid: boolean = regularExpresion.test(this.street);
        if (!isValid) throw new Error('Field street has invalid format, because the street must contain letters and numbers!');
    }

    public validateDepartment() {
        if (this.department === undefined || this.department.length === 0) throw new Error('Field department has invalid format because is undefined or empty!');
        const regularExpresion = /^[0-9a-zA-Z\s]*$/; // String Contains Only Letters, Spaces, numbers and is not Empty 
        const isValid: boolean = regularExpresion.test(this.department);
        if (!isValid) throw new Error('Field department has invalid format, because the street must contain letters and numbers!');
    }

    public validateFullAddress() {
        this.validateCountry();
        this.validateCity();
        this.validateState();
        this.validateNeighborhood();
        this.validateDepartment();
    };

};