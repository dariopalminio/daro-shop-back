import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { Product } from '../../../domain/model/product/product';
import { ProductDocument } from '../schema/product.schema';


export const CATEGORY_REPO_TOKEN = 'CategoryRepositoryImplementation'; //ModelToken
/**
 * Product Mongo repository implementation
 */
@Injectable()
export class ProductRepository implements IRepository<Product> {

    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
    ) { }

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Product[]> {
        let arrayDoc: ProductDocument[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | { $meta: "textScore" }> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.productModel.find({}).sort(mysort).skip(gap).limit(limit).exec();
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.productModel.find({}).exec();
        }
        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Product[]> {
        let arrayDoc: ProductDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | { $meta: "textScore" }> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.productModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.productModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    /**
     * To exclude fields in response choose to return object with the field excluded with cero value. For example:
     * const fieldsToExclude = {_id:0,title:0}
     * const filter= {“name”:“Jeff Bridges”}
     * db.collecion.find(filter,fieldsToExclude)
     * To not exclude fields use empty object: fieldsToExclude={}
     * pagination:
     * Page 1: skip = 0, limit = 10
     * Page 2: skip = 10, limit = 10
     * Page 3: skip = 20, limit = 10
     * 
     * Products.find(filter)
        .sort({[column]: order })
        .skip(parseInt(pageNumber, 10) * parseInt(nPerPage, 10))
        .limit(parseInt(nPerPage, 10));
        ((parseInt(page.toString(), 10)) - 1 ) * parseInt(limit.toString(), 10); //number = 
{ orderByField: -1 } .sort( { _id: -1 } )
     * @param query filter
     * @param projection fieldsToExclude
     * @param page 
     * @param limit //The limit is used to specify the maximum number of results to be returned.
     * @param orderByField 
     * @param isAscending 
     * @returns 
     */
    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: ProductDocument[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            let mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            const gap =  (page - 1) * limit;
            //skip method will skip the document as per the number which was we have used with the skip method.
            const ascending = 1;
            arrayDoc = await this.productModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.productModel.find(query).exec();
        }

        return arrayDoc;
    };

    /**
     * getById
     * If it does not find it, it returns null
     */
    async getById(id: string, fieldsToExclude?: any): Promise<Product> {
        if (fieldsToExclude) {
            const prodDoc: ProductDocument = await this.productModel.findById(id, fieldsToExclude).exec();
            const objCasted: Product = new Product(prodDoc);
            return objCasted;
        }
        const prodDoc: ProductDocument = await this.productModel.findById(id).exec();
        const objCasted: Product = new Product(prodDoc);
        return objCasted;
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<Product> {

        if (fieldsToExclude) {
            const prodDoc: ProductDocument = await this.productModel.findOne(query, fieldsToExclude);
            const objCasted: Product = new Product(prodDoc);
            return objCasted;
        }

        const prodDoc: ProductDocument = await this.productModel.findOne(query);
        const objCasted: Product = new Product(prodDoc);
        return objCasted;
    };

    async hasById(id: string): Promise<boolean> {
        const prodDoc: ProductDocument = await this.productModel.findById(id).exec();
        if (!prodDoc) return false;
        return true;
    };

    async hasByQuery(query: any): Promise<boolean> {
        const prodDoc: ProductDocument = await this.productModel.findOne(query);
        if (!prodDoc) return false;
        return true;
    };

    async create(prod: Product): Promise<Product> {
        const docCreated: ProductDocument = await this.productModel.create(prod);
        const objCasted: Product = new Product(docCreated);
        return objCasted;
    };
    
    async updateById(id: string, prod: Product): Promise<boolean> {
        const docUpdated: ProductDocument = await this.productModel.findByIdAndUpdate(id, prod, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async update(query: any, valuesToSet: any): Promise<boolean> {
        const docUpdated: ProductDocument = await this.productModel.findOneAndUpdate(query, valuesToSet, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async delete(id: string): Promise<boolean> {
        const docDeleted = await this.productModel.findByIdAndDelete(id, { useFindAndModify: false }).exec();
        return !!docDeleted; //doc is not null
    };

    /**
     * Convert Unmarshalled structure data (documents from Mongo) to Domain Object Structure (Domain classes)
     * @param schemaDocArray Unmarshalled structure data (documents from Mongo)
     * @returns Domain Object Structure (Domain classes)
     */
    castArrayDocToArrayDomainEntity(schemaDocArray: ProductDocument[]): Product[] {
        let domainEntityArray: Product[] = [];
        schemaDocArray.forEach(element => domainEntityArray.push(
            new Product(element)
        ));
        return domainEntityArray;
    };

    async count(query: any): Promise<number>{
       return await this.productModel.count(query,);
    };

};