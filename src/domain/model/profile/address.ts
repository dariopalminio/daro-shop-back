/**
 * Address Value Object
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 * Value Object is a DDD concept that is immutable and doesn’t have its own identity. 
 * Since it is immutable, it does not have public setter methods.
 */
export class Address {

    protected country: string;
    protected state: string; //region
    protected city: string;
    protected neighborhood: string; //commune
    protected street: string;
    protected department: string;
    //zipCode - not implemented

    public constructor();
    public constructor(addrsAny: any); 
    public constructor(country: string, state: string, city: string, neighborhood: string, street: string, department: string);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 5) {
            throw new Error('Number of constructor arguments exceeded (country, state, city, neighborhood, street, department)');
        }
        if (argumentsArray.length ===1) {
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            this._setCountry(argumentsArray[0]); //country
            this._setState(argumentsArray[1]); //state
            this._setCity(argumentsArray[2]); //city
            this._setNeighborhood(argumentsArray[3]); //neighborhood
            this._setStreet(argumentsArray[4]); //street
            this._setDepartment(argumentsArray[5]); //department
        }
    };

    public setFromAny(addrsAny: any) {
        if (addrsAny === undefined || addrsAny === null)
            throw new Error('Address is invalid (undefined or null)!');
        if (!addrsAny.country || !addrsAny.state || !addrsAny.city || !addrsAny.neighborhood || !addrsAny.street || !addrsAny.department)
            throw new Error('Address has some invalid field!');
        this._setCountry(addrsAny.country);
        this._setState(addrsAny.state);
        this._setCity(addrsAny.city);
        this._setNeighborhood(addrsAny.neighborhood);
        this._setStreet(addrsAny.street);
        this._setDepartment(addrsAny.department);
    };

    public getCountry(): string {
        return this.country;
    };

    public getState(): string {
        return this.state;
    };

    public getCity(): string {
        return this.city;
    };

    public getNeighborhood(): string {
        return this.neighborhood;
    };

    public getStreet(): string {
        return this.street;
    };

    public getDepartment(): string {
        return this.department;
    };

    private _setCountry(country: string) {
        this.country = country;
    }

    private _setCity(city: string) {
        this.city = city ? city : '';
    }

    private _setState(state: string) {
        this.state = state ? state : '';
    }

    private _setNeighborhood(neighborhood: string) {
        this.neighborhood = neighborhood ? neighborhood : '';
    }

    private _setStreet(street: string) {
        this.street = street ? street : '';
    }

    private _setDepartment(dept: string) {
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