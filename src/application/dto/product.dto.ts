import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsArray, IsNumber } from 'class-validator';
import { IProduct } from 'src/domain/model/product/product.interface';
import { IReservation } from 'src/domain/model/product/reservation.interface';

/**
 * Product DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
export class ProductDTO implements IProduct {

  @IsOptional()
  id?: string;

  @IsString()
  sku: string;

  @IsString()
  barcode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  images: string[];

  @IsString()
  category: string;

  @IsString()
  type: string;

  @IsString()
  brand: string;

  @IsString()
  color: string;

  @IsString()
  model: string;

  @IsString()
  gender: string;

  @IsString()
  size: string;

  @IsNumber()
  netCost: number;

  @IsNumber()
  ivaAmountOnCost: number;

  @IsNumber()
  grossCost: number;

  @IsNumber()
  netPrice: number;

  @IsNumber()
  ivaAmountOnPrice: number;

  @IsNumber()
  grossPrice: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsArray()
  reservations: IReservation[];

  @IsOptional()
  @IsArray()
  sales: any[];

};
