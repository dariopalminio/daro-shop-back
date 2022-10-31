import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsEmail, IsArray } from 'class-validator';
import { IAddress } from 'src/domain/model/profile/address.interface';
import { IProfile } from 'src/domain/model/profile/profile.interface';

/**
 * Profile DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
 export class ProfileDTO implements IProfile {

    @IsOptional()
    id?: string;
    
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsBoolean()
    enable: boolean;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    docType: string;  //docType (RUT|DNI...)

    @IsString()
    document: string;

    @IsString()
    telephone: string;

    @IsString()
    language: string;

    @IsArray()
    addresses: IAddress[];

    @IsOptional()
    updatedAt?: Date;

    @IsOptional()
    createdAt?: Date;
    
};