import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { IShippingPrice } from 'src/domain/model/shipping/shipping-price.interface';

/**
 * ShippingPrice DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
 export class ShippingPriceDTO  implements IShippingPrice {

    @IsOptional()
    id: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    money: string;

    @IsString()
    @IsNotEmpty()
    description: string;

};