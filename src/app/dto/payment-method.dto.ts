import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

/**
 * ShippingPrice DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
 export class PaymentMethodDTO {

    @IsOptional()
    _id: string;

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsBoolean()
    active: string;

    meta: any;

    //createdAt?: Date;
    //updatedAt?: Date;

};
