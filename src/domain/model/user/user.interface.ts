export interface IUser {

     enable: boolean;
     userName: string;
     firstName: string;
     lastName: string;
     email: string; //min: 6, max: 254
     password: string;
     roles: string[];
     verified: boolean;
     verificationCode: string;
     startVerificationCode: Date;
     updatedAt?: Date;
     createdAt?: Date;
}