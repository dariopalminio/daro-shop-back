import { Address } from "./address";
import { IAddress } from "./address.interface";

export interface IProfile {

     id?: string;
     userId: string;
     enable: boolean;
     userName: string;
     firstName: string;
     lastName: string;
     email: string;
     docType: string;  
     document: string;
     telephone: string;
     addresses: IAddress[];
     updatedAt?: Date;
     createdAt?: Date;
};
