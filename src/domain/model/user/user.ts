import { Entity } from '../entity';
import { IUser } from './user.interface';

/**
 * User domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class User extends Entity implements IUser {

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

    public setEnable(value: boolean) {
        if (value === undefined || typeof value !== "boolean")
            throw new Error('Field enable has invalid format because is undefined or is not boolean type!');
        this.enable = value;
    };

    public setUserName(value: string) {
        if (value === undefined || (typeof value[0] !== 'string'))
            throw new Error('Field userName has invalid format because is undefined or is not string!');
        this.userName = value;
    };

    public setFirstName(value: string) {
        if (value === undefined || (typeof value[0] !== 'string'))
            throw new Error('Field firstName has invalid format because is undefined or is not string!');
        this.firstName = value;
    };

    public setLastName(value: string) {
        if (value === undefined || (typeof value[0] !== 'string'))
            throw new Error('Field lastName has invalid format because is undefined or is not string!');
        this.lastName = value;
    };

    public setEmail(email: string) {
        if (email===undefined || email.length === 0) throw new Error('Field email has invalid format becuse is undefined or empty!');
        const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const hasClientEmail: boolean = expresionsRegularEmail.test(email);
        if (!hasClientEmail) throw new Error('Field email has invalid format!');
        this.email = email;
    }

    public setPassword(value: string) {
        if (value === undefined || (typeof value[0] !== 'string'))
            throw new Error('Field password has invalid format because is undefined or is not string!');
        this.password = value;
    };

    public setRoles(value: string[]) {
        if (value === undefined)
            throw new Error('Field roles has invalid format because is undefined!');
        const isAnArray: boolean = Array.isArray(value);
        if (!isAnArray) throw new Error('Field roles has invalid format because is not array!');
        this.roles = value;
    };

    public setVerified(value: boolean) {
        if (value === undefined || typeof value !== "boolean")
            throw new Error('Field verified has invalid format because is undefined or is not boolean type!');
        this.verified = value;
    };

    public setVerificationCode(value: string) {
        if (value === undefined || (typeof value[0] !== 'string'))
            throw new Error('Field verificationCode has invalid format because is undefined or is not string!');
        this.verificationCode = value;
    };

    public setStartVerificationCode(value: Date) {
        if (value === undefined || !(value instanceof Date))
        throw new Error('Field startVerificationCode has invalid format because is undefined or is not Date!');
        else
            this.startVerificationCode = value;
    };

};