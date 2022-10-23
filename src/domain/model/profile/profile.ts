import { Entity } from "../entity";
import { IAddress } from "./address.interface";
import { IProfile } from "./profile.interface";

/**
 * Profile domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
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
    //birth: Date;
    //gender: string;
    language: string;
    addresses: IAddress[];

};