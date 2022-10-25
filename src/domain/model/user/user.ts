import { Entity } from '../entity';

/**
 * User domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class User extends Entity {

    enable: boolean;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string[];
    verified: boolean;
    verificationCode: string;
    startVerificationCode: Date;

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
     public constructor();
     public constructor(usr: any);
     public constructor(
        enable: boolean, userName: string, firstName: string, lastName: string, email: string, password: string, roles: string[],
        verified: boolean, verificationCode: string
     );
     public constructor(...argumentsArray: any[]) {
         super();
         if (argumentsArray.length > 9) {
             throw new Error('Number of constructor arguments exceeded.');
         }
         if (argumentsArray.length === 1) {
             this.setFromAny(argumentsArray[0]);
         }
         if (argumentsArray.length > 1) {
             this.setEnable(argumentsArray[0]);
             this.setUserName(argumentsArray[1]);
             this.setFirstName(argumentsArray[2]);
             this.setLastName(argumentsArray[3]);
             this.setEmail(argumentsArray[4]);
             this.setPassword(argumentsArray[5]);
             this.setRoles(argumentsArray[6]);
             this.setVerified(argumentsArray[7]);
             this.setVerificationCode(argumentsArray[8]);
         }
     };

    /**
     * Set all attributes from variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param usr any is used to tell TypeScript that a variable can be of any type
     */
    public setFromAny(usr: any) {
        this.setUserName(usr.userName);
        this.setFirstName(usr.firstName);
        this.setLastName(usr.lastName);
        this.setEmail(usr.email);
        this.setPassword(usr.password);
        this.setRoles(usr.roles);
        if (usr.verified)
            this.setVerified(usr.verified);
        else this.verified = false;
        if (usr.verificationCode)
            this.setVerificationCode(usr.verificationCode);
        else this.verificationCode = 'none$none.none-none*none';
        if (usr.enable)
            this.setEnable(usr.enable);
        else this.enable = false;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setEnable(value: boolean) {
        if (value === undefined || typeof value !== "boolean")
            throw new Error('Field enable has invalid format because is undefined or is not boolean type!');
        this.enable = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setUserName(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        this.userName = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setFirstName(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field firstName has invalid format because is undefined or is not string!');
        this.firstName = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setLastName(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field lastName has invalid format because is undefined or is not string!');
        this.lastName = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setEmail(email: string) {
        if (email === undefined || email.length === 0) throw new Error('Field email has invalid format becuse is undefined or empty!');
        const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const hasClientEmail: boolean = expresionsRegularEmail.test(email);
        if (!hasClientEmail) throw new Error('Field email has invalid format!');
        this.email = email;
    }

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setPassword(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field password has invalid format because is undefined or is not string!');
        this.password = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setRoles(value: string[]) {
        if (value === undefined)
            throw new Error('Field roles has invalid format because is undefined!');
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field roles has invalid format because is not array!');
        this.roles = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setVerified(value: boolean) {
        if (value === undefined || typeof value !== "boolean")
            throw new Error('Field verified has invalid format because is undefined or is not boolean type!');
        this.verified = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setVerificationCode(value: string) {
        if (value === undefined || (typeof value !== 'string'))
            throw new Error('Field verificationCode has invalid format because is undefined or is not string!');
        this.verificationCode = value;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setStartVerificationCode(value: Date) {
        if (value === undefined || !(value instanceof Date))
            throw new Error('Field startVerificationCode has invalid format because is undefined or is not Date!');
        else
            this.startVerificationCode = value;
    };

};