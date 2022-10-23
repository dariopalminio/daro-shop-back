import { IEntity } from "../entity.interface";
import { IAddress } from "../profile/address.interface";

export interface IUser extends IEntity {

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
