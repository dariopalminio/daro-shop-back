import { Entity, IMarshable, IValidatable, convertAnyToDate } from "hexa-three-levels";
import { Address } from "./address";
import { IProfile } from "./profile.interface";

/**
 * Profile domain object
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class Profile extends Entity implements IValidatable, IMarshable<Profile> {

    protected userId: string;
    protected enable: boolean;
    protected userName: string;
    protected firstName: string;
    protected lastName: string;
    protected email: string;
    protected docType: string;  //docType (RUT|DNI)
    protected document: string;
    protected telephone: string;
    protected addresses: Address[];
    protected updatedAt?: Date;
    protected createdAt?: Date;

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string,
        userId: string, enable: boolean, userName: string, firstName: string, lastName: string, email: string, docType: string,
        document: string, telephone: string, addresses: Address[], updatedAt?: Date, createdAt?: Date
    );
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 13) {
            throw new Error('Number of constructor arguments exceeded.');
        }
        if (argumentsArray.length === 0) {
            super();
        }
        if (argumentsArray.length === 1) { //Constructor to unmarshalled input
            const id: string = argumentsArray[0]._id ? argumentsArray[0]._id.toString() : argumentsArray[0].id;
            super(id);
            this.setFromAny(argumentsArray[0]);
        }
        if (argumentsArray.length > 1) {
            super(argumentsArray[0]); //id
            this.setUserId(argumentsArray[1]);
            this.setEnable(argumentsArray[2]);
            this.setUserName(argumentsArray[3]);
            this.setFirstName(argumentsArray[4]);
            this.setLastName(argumentsArray[5]);
            this.setEmail(argumentsArray[6]);
            this.setDocType(argumentsArray[7]);
            this.setDocument(argumentsArray[8]);
            this.setTelephone(argumentsArray[9]);
            this.setAddresses(argumentsArray[11]);
            if (argumentsArray[12]) {
                this.updatedAt = (argumentsArray[12]);
            }
            if (argumentsArray[13]) {
                this.createdAt = (argumentsArray[13]);
            }
        }
    };

    public createFromAny(unmarshalled: any): Profile {
        return new Profile(unmarshalled);
    }

    public convertToAny(): any {
        const unmarshalled: IProfile =  {
            id: this.id,
            userId: this.userId,
            enable: this.enable,
            userName: this.userName,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            docType: this.docType,
            document: this.document,
            telephone: this.telephone,
            addresses: this.addresses.map((addrs) => (addrs.convertToAny())),
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        };
        return unmarshalled;
    };

    /**
    * Set all attributes from Unmarshalled variable can be of any type 'any'.
    * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
    * @param profileAny any is used to tell TypeScript that a variable can be of any type
    */
    public setFromAny(unmarshalled: any) {
        this.setUserId(unmarshalled.userId);
        if ((unmarshalled.enable !== undefined) && (unmarshalled.enable !== null)) {
            this.setEnable(unmarshalled.enable);
        } else {
            this.setEnable(false);
        }
        this.setUserName(unmarshalled.userName);
        this.setFirstName(unmarshalled.firstName);
        this.setLastName(unmarshalled.lastName);
        this.setEmail(unmarshalled.email);
        this.setDocType(unmarshalled.docType);
        this.setDocument(unmarshalled.document);
        this.setTelephone(unmarshalled.telephone);
        this.setAddresses(unmarshalled.addresses);
        if (unmarshalled.updatedAt) {
            this.updatedAt = convertAnyToDate(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt = convertAnyToDate(unmarshalled.createdAt);
        }
    };

    public getUserId(): string {
        return this.userId;
    };

    public getEnable(): boolean {
        return this.enable;
    };

    public getUserName(): string {
        return this.userName;
    };

    public getFirstName(): string {
        return this.firstName;
    };

    public getLastName(): string {
        return this.lastName;
    };

    public getEmail(): string {
        return this.email;
    };

    public getDocType(): string {
        return this.docType;
    };

    public getDocument(): string {
        return this.document;
    };

    public getTelephone(): string {
        return this.telephone;
    };

    public getAddresses(): Address[] {
        return this.addresses;
    };

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    };

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    };


    public setUserId(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field userId has invalid format because is undefined or is not string!');
        }
        this.userId = value;
    }

    public setEnable(value: boolean) {
        if (value === undefined || typeof value !== "boolean") { //required
            throw new Error('Field enable has invalid format because is undefined or is not boolean type!');
        }
        this.enable = value;
    };

    public setUserName(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        }
        this.userName = value;
    };

    public setFirstName(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field firstName has invalid format because is undefined or is not string!');
        }
        this.firstName = value;
    };

    public setLastName(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field lastName has invalid format because is undefined or is not string!');
        }
        this.lastName = value;
    };

    public setEmail(email: string) {
        if (email === undefined || (typeof email !== 'string')) { //required
            throw new Error('Field email has invalid format becuse is undefined or empty!');
        }
        this.email = email;
    };

    public setAddresses(value: Address[]) {
        if (value === undefined || value === null) { //required
            throw new Error('Field addresses has invalid format because is undefined or null!');
        }
        if (!Array.isArray(value)) {
            throw new Error('The field named addresses is no an Array!');
        }
        this.addresses = value;
    };

    public setDocType(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field docType has invalid format because is undefined or is not string!');
        }
        this.docType = value;
    };

    public setDocument(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field document has invalid format because is undefined or is not string!');
        }
        this.document = value;
    };

    public setTelephone(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field telephone has invalid format because is undefined or is not string!');
        }
        this.telephone = value;
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date)) { //required
            throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        }
        this.updatedAt = updatedAt;
    };

    /**
    * Validate format throw Error if if you do not meet any product format requirement
    */
    public validateFormat() {
        this.validateUserName();
        this.validateFirstName();
        this.validateLastName();
        this.validateEmail();
    };

    public validateUserName() {
        if (this.userName === undefined || this.userName === null || (typeof this.userName !== 'string')) {
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        }
        if (this.userName.length <= 2 || this.userName.length > 100) {
            throw new Error('Field userName must be greater than 2 chars and less than 100.')
        }
    };

    public validateFirstName() {
        if (this.firstName === undefined || (typeof this.firstName !== 'string')) { //required
            throw new Error('Field firstName has invalid format because is undefined or is not string!');
        }
        if (this.firstName.length <= 2 || this.firstName.length > 100) {
            throw new Error('Field firstName must be greater than 3 chars and less than 100.')
        }
    };

    public validateLastName() {
        if (this.lastName === undefined || (typeof this.lastName !== 'string')) { //required
            throw new Error('Field lastName has invalid format because is undefined or is not string!');
        }
        if (this.lastName.length <= 2 || this.lastName.length > 100) {
            throw new Error('Field lastName must be greater than 3 chars and less than 100.')
        }
    };

    /**
     * Validate email min: 6, max: 254 characters
     */
    public validateEmail() {
        if (this.email === undefined || (typeof this.email !== 'string')) {
            throw new Error('Field email in user has invalid format. Email must be a string.');
        }
        if (this.email.length === 0) {
            throw new Error('Field email has invalid format becuse is empty! Email must be a string with length > 0.');
        }
        if (this.email.length < 6) {
            throw new Error('The number of characters in user email is short, the email is very short!');
        }
        if (this.email.length > 254) {
            throw new Error('The number of characters in user email is too many, the email is too long!');
        }
        const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const emailValid: boolean = expresionsRegularEmail.test(this.email);
        if (!emailValid) {
            throw new Error('Field user email has invalid email format!');
        }
    };


};