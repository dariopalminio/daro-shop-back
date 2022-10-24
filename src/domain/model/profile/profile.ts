import { Entity } from "../entity";
import { IAddress } from "./address.interface";
import { IProfile } from "./profile.interface";

/**
 * Profile domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Profile extends Entity implements IProfile {

    userId: string;
    enable: boolean;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    docType: string;  //docType (RUT|DNI)
    document: string;
    telephone: string;
    language: string;
    addresses: IAddress[];

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(
        userId: string, enable: boolean, userName: string, firstName: string, lastName: string, email: string, docType: string,
        document: string, telephone: string, language: string, addresses: IAddress[]
    );
    public constructor(...argumentsArray: any[]) {
        super();
        if (argumentsArray.length > 11) throw new Error('Number of constructor arguments exceeded.');
        if (argumentsArray.length > 0) {
            this.setUserId(argumentsArray[0]);
            this.setEnable(argumentsArray[1]);
            this.setUserName(argumentsArray[2]);
            this.setFirstName(argumentsArray[3]);
            this.setLastName(argumentsArray[4]);
            this.setEmail(argumentsArray[5]);
            this.setDocType(argumentsArray[6]);
            this.setDocument(argumentsArray[7]);
            this.setTelephone(argumentsArray[8]);
            this.setLanguage(argumentsArray[9]);
            this.setAddresses(argumentsArray[10]);
        }
    };

    public setUserId(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field userId has invalid format because is undefined or is not string!');
        }
        this.userId = value;
    }

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setEnable(value: boolean) {
        if (value === undefined || typeof value !== "boolean"){
            throw new Error('Field enable has invalid format because is undefined or is not boolean type!');
        }
        this.enable = value;
    };

    public setUserName(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        }
        this.userName = value;
    };

    public setFirstName(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field firstName has invalid format because is undefined or is not string!');
        }
        this.firstName = value;
    };


    public setLastName(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field lastName has invalid format because is undefined or is not string!');
        }
        this.lastName = value;
    };

    public setEmail(email: string) {
        if (email === undefined || email.length === 0) {
            throw new Error('Field email has invalid format becuse is undefined or empty!');
        }
        const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const hasClientEmail: boolean = expresionsRegularEmail.test(email);
        if (!hasClientEmail) throw new Error('Field email has invalid format!');
        this.email = email;
    };

    public setAddresses(value: IAddress[]) {
        if (value === undefined || value === null) {
            throw new Error('Field addresses has invalid format because is undefined or null!');
        }
        if (!Array.isArray(value)) {
            throw new Error('The field named addresses is no an Array!');
        }
        this.addresses = value;
    };

    public setDocType(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field docType has invalid format because is undefined or is not string!');
        }
        this.docType = value;
    };

    public setDocument(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field document has invalid format because is undefined or is not string!');
        }
        this.document = value;
    };

    public setTelephone(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field telephone has invalid format because is undefined or is not string!');
        }
        this.telephone = value;
    };

    public setLanguage(value: string) {
        if (value === undefined || (typeof value !== 'string')){
            throw new Error('Field language has invalid format because is undefined or is not string!');
        }
        this.language = value;
    };

};