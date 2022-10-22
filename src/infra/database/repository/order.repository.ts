import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/output-port/repository.interface';
import { Order } from '../../../domain/model/order/order';
import { OrderDocument } from '../schema/order.schema';
import { IOrder } from 'src/domain/model/order/order.interface';


/**
 * Order Mongo repository implementation
 */
@Injectable()
export class OrderRepository implements IRepository<IOrder> {

    constructor(
        @InjectModel('Order')
        private readonly entityModel: Model<OrderDocument>,
    ) { }

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
        let arrayDoc: OrderDocument[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            console.log(`getAll page ${page} /limit ${limit} orderByField ${orderByField}`);
            const sort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const direction: number = isAscending ? 1 : -1;

            //const mysort = [[orderByField, direction]]; //'string | { [key: string]: SortOrder | { $meta: "textScore"; }; }'
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.entityModel.find({}).sort(sort).skip(gap).limit(limit).exec();
            //rgument of type '(string | number)[][]' is not assignable to parameter of type 'string | { [key: string]: SortOrder | { $meta: "textScore"; }; }'.
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            console.log(`getAll without page/limit`);
            arrayDoc = await this.entityModel.find({}).exec();
        }
        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
        let arrayDoc: OrderDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.entityModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.entityModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    }

    
    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: OrderDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            //const mysort = { description: 1 };
            const gap: number = (page - 1) * limit;
            //db.text.find({ $text : { $search : "cake" }},{ score: { $meta: "textScore" }})
            //{ $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }

            arrayDoc = await this.entityModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.entityModel.find(query).exec();
        }

        return arrayDoc;
    };
    
    async getById(id: string, fieldsToExclude?: any): Promise<IOrder> {
        const entryDoc: OrderDocument = await this.entityModel.findById(id).exec();
        //Doc has id name "_id"
        const objCasted: IOrder = JSON.parse(JSON.stringify(entryDoc));
        return objCasted;
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<IOrder> {
        if (fieldsToExclude) {
            const entryDoc: OrderDocument = await this.entityModel.findOne(query, fieldsToExclude);
            const objCasted: IOrder = JSON.parse(JSON.stringify(entryDoc));
            return objCasted;
        }
        const entryDoc: OrderDocument = await this.entityModel.findOne(query);
        const objCasted: IOrder = JSON.parse(JSON.stringify(entryDoc));
        return objCasted;
    }

    async hasById(id: string): Promise<boolean> {
        const entryDoc: OrderDocument = await this.entityModel.findById(id).exec();
        if (!entryDoc) return false;
        return true;
    }

    async hasByQuery(query: any): Promise<boolean> {
        const entryDoc: OrderDocument = await this.entityModel.findOne(query);
        if (!entryDoc) return false;
        return true;
    }

    async create(order: IOrder): Promise<IOrder> {
        const docCreated: OrderDocument = await this.entityModel.create(order);
        const objCasted: IOrder = JSON.parse(JSON.stringify(docCreated));
        return objCasted;
    };

    async updateById(id: string, doc: any): Promise<boolean> {
        const docUpdated: OrderDocument = await this.entityModel.findByIdAndUpdate(id, doc, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async update(query: any, valuesToSet: any): Promise<boolean> {
        const docUpdated: OrderDocument = await this.entityModel.findOneAndUpdate(query, valuesToSet, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };

    async delete(id: string): Promise<boolean> {
        const docDeleted = await this.entityModel.findByIdAndDelete(id, { useFindAndModify: false }).exec();
        return !!docDeleted; //doc is not null
    };

    castArrayDocToArrayDomainEntity(schemaDocArray: OrderDocument[]): IOrder[] {
        let entitiesArray: Order[] = [];
        schemaDocArray.forEach(element => entitiesArray.push(
            JSON.parse(JSON.stringify(element))
        ));
        return entitiesArray;
    };

    async count(query: any): Promise<number>{
        return await this.entityModel.count(query,);
     };

}