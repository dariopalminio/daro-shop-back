import { IAddress } from "../../../common/domain/model/address";

export interface IProfile {

     id?: string;
     userId: string;
     enable: boolean;
     username: string;
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
