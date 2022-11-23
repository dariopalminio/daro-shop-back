import { IBusiness } from "../domain/Business.entity";
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class BusinessDTO implements IBusiness {

    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    taxIdNum: string;

    @IsString()
    @IsNotEmpty()
    socialReason: string;

    @IsString()
    @IsNotEmpty()
    fantasyName: string;

    @IsString()
    @IsNotEmpty()
    activity: string;

    @IsString()
    @IsNotEmpty()
    addressLine: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    message: string;

};
