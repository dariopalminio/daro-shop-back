import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/infra-interface/repository.interface';
import { User } from '../../../domain/model/user/user';
import { UserDocument } from '../schema/user.schema';

/**
 * User Mongo repository implementation
 */
@Injectable()
export class UserRepository implements IRepository<User> {

    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserDocument>,
    ) { }
   

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<User[]> {
        let arrayDoc: UserDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.userModel.find({}).sort(mysort).skip(gap).limit(limit).exec();
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.userModel.find({}).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<User[]> {
        let arrayDoc: UserDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.userModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.userModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    }

    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: UserDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            let mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.userModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.userModel.find(query).exec();
        }

        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async getById(id: string, fieldsToExclude?: any): Promise<User> {
        if (fieldsToExclude) {
            const userDoc: UserDocument = await this.userModel.findById(id, fieldsToExclude).exec();
            //Doc has id name "_id"
            const objCasted: User = new User(userDoc);
            return objCasted;
        }
        const userDoc: UserDocument = await this.userModel.findById(id).exec();
        //Doc has id name "_id"
        const objCasted: User = new User(userDoc);
        return objCasted;
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<User> {
        if (fieldsToExclude) {
            const userDoc: UserDocument =  await this.userModel.findOne(query, fieldsToExclude);
            const objCasted: User = new User(userDoc);
            return objCasted;
        }
        const userDoc: UserDocument =  await this.userModel.findOne(query);
        const objCasted: User = new User(userDoc);
        return objCasted;
    }

    async hasById(id: string): Promise<boolean> {
        const userDoc: UserDocument = await this.userModel.findById(id).exec();
        if (!userDoc) return false;
        return true;
    }

    async hasByQuery(query: any): Promise<boolean> {
        const userDoc: UserDocument =  await this.userModel.findOne(query);
        if (!userDoc) return false;
        return true;
    }

    async create(doc: User): Promise<User> {
        const docCreated: UserDocument = await this.userModel.create(doc);
        //const objCasted: User = JSON.parse(JSON.stringify(docCreated));
        const objCasted: User = new User(docCreated);
        return objCasted;
    }

    async updateById(id: string, doc: any): Promise<boolean> {
        const docUpdated: UserDocument = await this.userModel.findByIdAndUpdate(id, doc, {useFindAndModify: false}).exec();
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
        const docUpdated: UserDocument = await this.userModel.findOneAndUpdate(query, valuesToSet, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };


    async delete(id: string): Promise<boolean> {
        //Replace remove() with deleteOne() or deleteMany().
        const docDeleted = await this.userModel.findByIdAndDelete(id, {useFindAndModify: false}).exec();
        return !!docDeleted; //doc is not null
    };

    /**
     * Convert Unmarshalled structure data (documents from Mongo) to Domain Object Structure (Domain classes)
     * @param schemaDocArray Unmarshalled structure data (documents from Mongo)
     * @returns Domain Object Structure (Domain classes)
     */
    castArrayDocToArrayDomainEntity(schemaDocArray: UserDocument[]): User[] {
        let entityArray: User[] = [];
        schemaDocArray.forEach(element => entityArray.push(
            //new User(element)))
            new User(element)
        ));
        return entityArray;
    };

    async count(query: any): Promise<number>{
        return await this.userModel.count(query,);
     };

}