import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/output-port/repository.interface';
import { ICategory } from '../../../domain/model/category/category.interface';
import { Category } from '../../../domain/model/category/category';
import { CategoryDocument } from '../schema/category.schema';


/**
 * Mongo repository implementation
 */
@Injectable()
export class CategoryRepository implements IRepository<ICategory> {

    constructor(
        @InjectModel('Category')
        private readonly categoryModel: Model<CategoryDocument>,
    ) { }

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ICategory[]> {
        let arrayDoc: CategoryDocument[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            console.log(`getAll page ${page} /limit ${limit} orderByField ${orderByField}`);
            const sort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const direction: number = isAscending ? 1 : -1;

            //const mysort = [[orderByField, direction]]; //'string | { [key: string]: SortOrder | { $meta: "textScore"; }; }'
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.categoryModel.find({}).sort(sort).skip(gap).limit(limit).exec();
            //rgument of type '(string | number)[][]' is not assignable to parameter of type 'string | { [key: string]: SortOrder | { $meta: "textScore"; }; }'.
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            console.log(`getAll without page/limit`);
            arrayDoc = await this.categoryModel.find({}).exec();
        }
        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ICategory[]> {
        let arrayDoc: CategoryDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.categoryModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.categoryModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    }

    
    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: CategoryDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            //const mysort = { description: 1 };
            const gap: number = (page - 1) * limit;
            //db.text.find({ $text : { $search : "cake" }},{ score: { $meta: "textScore" }})
            //{ $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }

            arrayDoc = await this.categoryModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.categoryModel.find(query).exec();
        }

        //return this.castArrayDocToCategory(arrayDoc);
        return arrayDoc;
    };
    
    async getById(id: string, fieldsToExclude?: any): Promise<ICategory> {
        const catDoc: CategoryDocument = await this.categoryModel.findById(id).exec();
        //Doc has id name "_id"
        const objCasted: ICategory = JSON.parse(JSON.stringify(catDoc));
        return objCasted;
        //return this.conversorDocToCategory(catDoc);
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<ICategory> {
        if (fieldsToExclude) {
            const catDoc: CategoryDocument = await this.categoryModel.findOne(query, fieldsToExclude);
            const objCasted: ICategory = JSON.parse(JSON.stringify(catDoc));
            return objCasted;
        }
        const catDoc: CategoryDocument = await this.categoryModel.findOne(query);
        const objCasted: ICategory = JSON.parse(JSON.stringify(catDoc));
        return objCasted;
    }

    async hasById(id: string): Promise<boolean> {
        const catDoc: CategoryDocument = await this.categoryModel.findById(id).exec();
        if (!catDoc) return false;
        return true;
    }

    async hasByQuery(query: any): Promise<boolean> {
        const catDoc: CategoryDocument = await this.categoryModel.findOne(query);
        if (!catDoc) return false;
        return true;
    }

    async create<ICategory>(doc: ICategory): Promise<boolean> {
        const docCreated: CategoryDocument = await this.categoryModel.create(doc);
        return !!docCreated;
    };

    async updateById(id: string, doc: any): Promise<boolean> {
        const docUpdated: CategoryDocument = await this.categoryModel.findByIdAndUpdate(id, doc, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async update(query: any, valuesToSet: any): Promise<boolean> {
        const docUpdated: CategoryDocument = await this.categoryModel.findOneAndUpdate(query, valuesToSet, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };

    async delete(id: string): Promise<boolean> {
        const docDeleted = await this.categoryModel.findByIdAndDelete(id, { useFindAndModify: false }).exec();
        return !!docDeleted; //doc is not null
    };

    /**
    * Convert from Mongo CategoryDocument to Category class. 
    * This is a Casting function.
    * @param categoryDoc 
    * @returns 
    */
    conversorDocToCategory(categoryDoc: CategoryDocument): ICategory {
        return new Category(
            String(categoryDoc._id),
            String(categoryDoc.name),
            String(categoryDoc.description));
    };

    castArrayDocToArrayDomainEntity(schemaDocArray: CategoryDocument[]): ICategory[] {
        let domainEntityArray: Category[] = [];
        schemaDocArray.forEach(element => domainEntityArray.push(
            JSON.parse(JSON.stringify(element))
        ));
        return domainEntityArray;
    };

    async count(query: any): Promise<number>{
        return await this.categoryModel.count(query,);
     };

}