import { IEntity } from "../entity.interface";
import { IAddress } from "./address.interface";


export interface IProfile extends IEntity{

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
