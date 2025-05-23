
import { Entity, IMarshable, IValidatable, IEntityFactory } from "hexa-three-levels";

export interface IBusiness {
    id?: string;
    country: string;
    taxIdNum: string;
    socialReason: string;
    fantasyName: string;
    activity: string;
    addressLine: string;
    email: string;
    phone: string;
    message: string;
};

export class BusinessEntityFactory implements IEntityFactory<Business> {
    createInstance(unmarshalled: any): Business {
        return new Business(unmarshalled);
    }
};

export class Business extends Entity implements IValidatable, IMarshable<Business> {

    country: string;
    //Tax Identification Numbers: TIN (EEUU), RUT (Chile), CUIT (Argentina), NIT (Colombia)
    taxIdNum: string; 

    //Tax Identification Name
    socialReason: string;

    fantasyName: string;
    activity: string; // giro (in Chile)
    addressLine: string;
    email: string; // contact
    phone: string;
    message: string; // general message shown to the public


    public constructor(unmarshalled: any);
    public constructor(id: string, country: string, taxIdNum: string, socialReason: string, fantasyName: string, activity: string, addressLine: string, email: string, phone: string, message: string);
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 10) {
            throw new Error('Number of constructor arguments exceeded');
        }
        if (argumentsArray.length === 0) {
            super();
        }
        if (argumentsArray.length === 1) {
            const id: string = argumentsArray[0]._id ? argumentsArray[0]._id.toString() : argumentsArray[0].id;
            super(id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            this.country = argumentsArray[1];
            this.taxIdNum = argumentsArray[2];
            this.socialReason = argumentsArray[3];
            this.fantasyName = argumentsArray[4];
            this.activity = argumentsArray[5];
            this.addressLine = argumentsArray[6];
            this.email = argumentsArray[7];
            this.phone = argumentsArray[8];
            this.message = argumentsArray[9];
        }
    };

    private setFromAny(unmarshalled: any) {
        this.country = unmarshalled.country;
        this.taxIdNum = unmarshalled.taxIdNum;
        this.socialReason = unmarshalled.socialReason;
        this.fantasyName = unmarshalled.fantasyName;
        this.activity = unmarshalled.activity;
        this.addressLine = unmarshalled.addressLine;
        this.email = unmarshalled.email;
        this.phone = unmarshalled.phone;
        this.message = unmarshalled.message;
    };

    createFromAny(unmarshalled: any): Business {
        return new Business(unmarshalled);
    };

    public convertToAny(): any {
        const unmarshalled: IBusiness = {
            country: this.country,
            id: this.id,
            taxIdNum: this.taxIdNum,
            socialReason: this.socialReason,
            fantasyName: this.fantasyName,
            activity: this.activity,
            addressLine: this.addressLine,
            email: this.email,
            phone: this.phone,
            message: this.message
        };
        return unmarshalled;
    };

    public validateFormat(): void {
        throw new Error('Method not implemented.');
    };


    public getCountry(): string {
        return this.country;
    };

    public getTaxIdNum(): string {
        return this.taxIdNum;
    };

    public getSocialReason(): string {
        return this.socialReason;
    };

    public getFantasyName(): string {
        return this.fantasyName;
    };

    public getActivity(): string {
        return this.activity;
    };

    public getAddressLine(): string {
        return this.addressLine;
    };

    public getEmail(): string {
        return this.email;
    };

    public getPhone(): string {
        return this.phone;
    };

    public getMessage(): string {
        return this.message;
    };

    public setCountry(value: string) {
        this.country = value;
    };

    public setTaxIdNum(value: string) {
        this.taxIdNum = value;
    };

    public setSocialReason(value: string) {
        this.socialReason = value;
    };

    public setFantasyName(value: string) {
        this.fantasyName = value;
    };

    public setActivity(value: string) {
        this.activity = value;
    };

    public setAddressLine(value: string) {
        this.addressLine = value;
    };

    public setEmail(value: string) {
        this.email = value;
    };

    public setPhone(value: string) {
        this.phone = value;
    };

    public setMessage(value: string) {
        this.message = value;
    };


};
