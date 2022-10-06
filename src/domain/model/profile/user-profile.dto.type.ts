import { IAddress } from "./address.interface";

export type UserProfileDTO = {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    docType: string; 
    document: string;
    telephone: string;
    language: string;
    addresses: IAddress[];
  };