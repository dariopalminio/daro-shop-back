import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICategory } from 'src/product/domain/model/category.entity';

/**
 * Category DTO
 * 
 * Note 1 (DTO): Data Transfer Object is an object that carries data between processes.
 * DTO Pattern is used for transferring data outside the domain layer.
 * Note 2 (Validation): It is best practice to validate the correctness of any data sent into a web application. 
 * To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box: ValidationPipe using class-validator.
 */
 export class CategoryDTO  implements ICategory{

    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

};