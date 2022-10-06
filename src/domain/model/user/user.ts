import { IUser } from './user.interface';

export class User implements IUser {

    _id: string;
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