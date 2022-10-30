import { convertAnyToDate } from 'src/domain/helper/date.helper';
import { Entity } from '../entity';
import { Validatable } from '../validatable.interface';

export const INVALID_VERIFICATION_CODE = 'none$none.none-none*none&none/none';
/**
 * User domain object as Entity
 * 
 * Note: An object primarily defined by its identity is called an Entity.
 * The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * This Domain Object is persistence-ignorant objects, is a class which doesn't depend on any framework-specific base class. 
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class User extends Entity implements Validatable{

    protected enable: boolean;
    protected userName: string;
    protected firstName: string;
    protected lastName: string;
    protected email: string; //min: 6, max: 254
    protected password: string;
    protected roles: string[];
    protected verified: boolean;
    protected verificationCode: string;
    protected startVerificationCode: Date;
    protected updatedAt?: Date;
    protected createdAt?: Date;

    /**
    * Constructors 
    * TypeScript does not support the implementation of multiple constructors directly. We have to use alternative ways to support multiple constructors.
    */
    public constructor();
    public constructor(unmarshalled: any);
    public constructor(id: string,
        enable: boolean, userName: string, firstName: string, lastName: string, email: string, password: string, roles: string[],
        verified: boolean, verificationCode: string, updatedAt?: Date, createdAt?: Date
    );
    public constructor(...argumentsArray: any[]) {
        if (argumentsArray.length > 12) {
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
            super(argumentsArray[0]); //id
            this.setEnable(argumentsArray[1]);
            this.setUserName(argumentsArray[2]);
            this.setFirstName(argumentsArray[3]);
            this.setLastName(argumentsArray[4]);
            this.setEmail(argumentsArray[5]);
            this.setPassword(argumentsArray[6]);
            this.setRoles(argumentsArray[7]);
            this.setVerified(argumentsArray[8]);
            this.setVerificationCode(argumentsArray[9]);
            if (argumentsArray[10]) {
                this.updatedAt = (argumentsArray[10]);
            }
            if (argumentsArray[11]) {
                this.createdAt = (argumentsArray[11]);
            }
        }
    };

    /**
     * Set all attributes from Unmarshalled variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO or schema data from database, to the data type of this class.
     * @param usr Unmarshalled or any is used to tell TypeScript that a variable can be of any type
     */
    public setFromAny(unmarshalled: any) {
        this.setUserName(unmarshalled.userName);
        this.setFirstName(unmarshalled.firstName);
        this.setLastName(unmarshalled.lastName);
        this.setEmail(unmarshalled.email);
        this.setPassword(unmarshalled.password);
        this.setRoles(unmarshalled.roles);
        if (unmarshalled.verified)
            this.setVerified(unmarshalled.verified);
        else this.verified = false;
        if (unmarshalled.verificationCode)
            this.setVerificationCode(unmarshalled.verificationCode);
        else this.verificationCode = INVALID_VERIFICATION_CODE;
        if ((unmarshalled.enable !== undefined) && (unmarshalled.enable !== null)) {
            this.setEnable(unmarshalled.enable);
        }
        else {
            this.enable = false;
        }
        if (unmarshalled.updatedAt) {
            this.updatedAt = convertAnyToDate(unmarshalled.updatedAt);
        }
        if (unmarshalled.createdAt) {
            this.createdAt = convertAnyToDate(unmarshalled.createdAt);
        }
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
     * To limit the length of a user's name. Let's say that it can be no longer than 100 characters, and it must be at least 2 characters.
     */
    public setUserName(value: string) {
        if (value === undefined || value === null || (typeof value !== 'string')) {
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        }
        this.userName = value;
    };

    /**
     * Setter method with basic Attributes/Properties Validation
     */
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
            throw new Error('Field email has invalid format becuse is undefined or not a string!');
        }
        this.email = email;
    }

    public setPassword(value: string) {
        if (value === undefined || (typeof value !== 'string')) {//required
            throw new Error('Field password has invalid format because is undefined or is not string!');
        }
        this.password = value;
    };

    public setRoles(value: string[]) { //required
        if (value === undefined) {
            throw new Error('Field roles has invalid format because is undefined!');
        }
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) {
            throw new Error('Field roles has invalid format because is not array!');
        }
        this.roles = value;
    };

    public setVerified(value: boolean) {
        if (value === undefined || typeof value !== "boolean") { //required
            throw new Error('Field verified has invalid format because is undefined or is not boolean type!');
        }
        this.verified = value;
    };

    public setVerificationCode(value: string) {
        if (value === undefined || (typeof value !== 'string')) { //required
            throw new Error('Field verificationCode has invalid format because is undefined or is not string!');
        }
        this.verificationCode = value;
    };

    public setStartVerificationCode(value: Date) {
        if (value === undefined || !(value instanceof Date)) { //required
            throw new Error('Field startVerificationCode has invalid format because is undefined or is not Date!');
        }
        this.startVerificationCode = value;
    };

    public setUpdatedAt(updatedAt: Date) {
        if (updatedAt === undefined || !(updatedAt instanceof Date)) //required
            throw new Error('Field updatedAt has invalid format because is undefined or is not Date!');
        this.updatedAt = updatedAt;
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

    public getPassword(): string {
        return this.password;
    };

    public getEmail(): string {
        return this.email;
    };

    public getRoles(): string[] {
        return this.roles;
    };

    public getVerified(): boolean {
        return this.verified;
    };

    public getVerificationCode(): string {
        return this.verificationCode;
    };

    public getStartVerificationCode(): Date {
        return this.startVerificationCode;
    };

    public getUpdatedAt(): Date {
        return this.updatedAt;
    };

    public getCreatedAt(): Date {
        return this.createdAt;
    };

    public hasRole(rol: string): boolean {
        return this.roles.includes(rol);
    };

    /**
     * Validate format throw Error if if you do not meet any user format requirement
     */
    public validateFormat() {
        this.validateUserName();
        this.validateFirstName();
        this.validateLastName();
        this.validateEmail();
        this.validatePassword();
    };

    public validateUserName() {
        if (this.userName === undefined || this.userName === null || (typeof this.userName !== 'string')){
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

    public validatePassword() {
        if (this.password === undefined || (typeof this.password !== 'string')) {
            throw new Error('Field password has invalid format because is undefined or is not string!');
        }
        if (this.password.length <= 2 || this.password.length > 100) {
            throw new Error('Field password must be greater than 2 chars and less than 100.')
        }
    };

};