import { IAddress } from "./address.interface";
import { IProfile } from "./profile.interface";


export class Profile implements IProfile {

    _id: string;
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