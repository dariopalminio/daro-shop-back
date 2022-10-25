import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { IRepository } from '../../../domain/infra-interface/repository.interface';
import { ShippingPriceDocument } from '../schema/shipping-price.schema';

/**
 * ShippingPrice Mongo repository implementation
 */
@Injectable()
export class ShippingPriceRepository implements IRepository<ShippingPrice> {

    constructor(
        @InjectModel('ShippingPrice')
        private readonly shippingPriceModel: Model<ShippingPriceDocument>,
    ) { }
   

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ShippingPrice[]> {
        let arrayDoc: ShippingPriceDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.shippingPriceModel.find({}).sort(mysort).skip(gap).limit(limit).exec();
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.shippingPriceModel.find({}).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
        //return this.conversorArrayDocToCategory(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<ShippingPrice[]> {
        let arrayDoc: ShippingPriceDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.shippingPriceModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.shippingPriceModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    }

    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: ShippingPriceDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            let mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.shippingPriceModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.shippingPriceModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async getById(id: string, fieldsToExclude?: any): Promise<ShippingPrice> {
        if (fieldsToExclude) {
            const profileDoc: ShippingPriceDocument = await this.shippingPriceModel.findById(id, fieldsToExclude).exec();
            //Doc has id name "_id"
            const objCasted: ShippingPrice = JSON.parse(JSON.stringify(profileDoc));
            return objCasted;
        }
        const profileDoc: ShippingPriceDocument = await this.shippingPriceModel.findById(id).exec();
        //Doc has id name "_id"
        const objCasted: ShippingPrice = JSON.parse(JSON.stringify(profileDoc));
        return objCasted;
        //return this.conversorDocToCategory(catDoc);
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<ShippingPrice> {
        if (fieldsToExclude) {
            const profileDoc: ShippingPriceDocument =  await this.shippingPriceModel.findOne(query, fieldsToExclude);
            const objCasted: ShippingPrice = JSON.parse(JSON.stringify(profileDoc));
            return objCasted;
        }
        const profileDoc: ShippingPriceDocument =  await this.shippingPriceModel.findOne(query);
        const objCasted: ShippingPrice = JSON.parse(JSON.stringify(profileDoc));
        return objCasted;
    }

    async hasById(id: string): Promise<boolean> {
        const profileDoc: ShippingPriceDocument = await this.shippingPriceModel.findById(id).exec();
        if (!profileDoc) return false;
        return true;
    }

    async hasByQuery(query: any): Promise<boolean> {
        const profileDoc: ShippingPriceDocument =  await this.shippingPriceModel.findOne(query);
        if (!profileDoc) return false;
        return true;
    }

    async create(doc: ShippingPrice): Promise<ShippingPrice> {
        const docCreated: ShippingPriceDocument = await this.shippingPriceModel.create(doc);
        const objCasted: ShippingPrice = JSON.parse(JSON.stringify(docCreated));
        return objCasted;
    }

    async updateById(id: string, doc: any): Promise<boolean> {
        const docUpdated: ShippingPriceDocument = await this.shippingPriceModel.findByIdAndUpdate(id, doc, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };

    /**
     * 
     * Example:
     * { user_id: userId, username: username },
        { security_stamp: nonce, security_stamp_updated: new Date() }
     * @param one 
     * @param query 
     * @returns 
     */
    async update(query: any, valuesToSet: any): Promise<boolean> {
        //DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
        //Replace update() with updateOne(), updateMany(), or replaceOne()
        const docUpdated: ShippingPriceDocument = await this.shippingPriceModel.findOneAndUpdate(query, valuesToSet, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };


    async delete(id: string): Promise<boolean> {
        //Replace remove() with deleteOne() or deleteMany().
        const docDeleted = await this.shippingPriceModel.findByIdAndDelete(id, {useFindAndModify: false}).exec();
        return !!docDeleted; //doc is not null
    };

      
    castArrayDocToArrayDomainEntity(entityDocArray: ShippingPriceDocument[]): ShippingPrice[] {
        let entitiesArray: ShippingPrice[] = [];
        entityDocArray.forEach(element => entitiesArray.push(
            JSON.parse(JSON.stringify(element))
        ));
        return entitiesArray;
    };

    async count(query: any): Promise<number>{
        return await this.shippingPriceModel.count(query,);
     };

}