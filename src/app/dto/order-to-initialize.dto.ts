import { IsNotEmpty, IsString, IsEmail, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';

/**
 * Order To Initialize DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
export class OrderToInitializeDTO {

    @IsOptional()
    _id?: string; //_id: holds an ObjectId.

    @IsNotEmpty()
    @IsObject()
    client: any;

    @IsNotEmpty()
    @IsArray()
    orderItems: any[];

    @IsOptional()
    count: number;

    @IsNotEmpty()
    @IsBoolean()
    includesShipping: boolean; //if is false then includes pick up in store

    @IsNotEmpty()
    @IsObject()
    shippingAddress: any;

    @IsOptional()
    subTotal: number;

    @IsOptional()
    shippingPrice: number;

    @IsOptional()
    total: number;

    @IsOptional()
    status: string;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;
};