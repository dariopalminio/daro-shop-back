import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';
import { IClient } from 'src/order/domain/model/client.interface';
import { IOrderItem } from 'src/order/domain/model/order-item.interface';
import { IOrder } from 'src/order/domain/model/order.interface';
import { IAddress } from 'src/common/domain/model/address';

/**
 * Order To Create DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
export class OrderToCreateDTO implements IOrder {

    @IsOptional()
    id?: string; //_id: holds an ObjectId.

    @IsNotEmpty()
    @IsObject()
    client: IClient;

    @IsNotEmpty()
    @IsArray()
    orderItems: IOrderItem[];

    @IsNotEmpty()
    count: number;

    @IsNotEmpty()
    @IsBoolean()
    includesShipping: boolean; //if is false then includes pick up in store

    @IsNotEmpty()
    @IsObject()
    shippingAddress: IAddress;

    @IsNotEmpty()
    subTotal: number;

    @IsNotEmpty()
    shippingPrice: number;

    @IsNotEmpty()
    total: number;

    @IsOptional()
    status: string;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;
};