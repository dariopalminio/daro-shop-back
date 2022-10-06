import { IAddress } from "../profile/address.interface";

export interface IUser{
    _id: string; //_id: holds an ObjectId.
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
};
