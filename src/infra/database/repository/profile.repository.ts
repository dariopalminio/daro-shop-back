import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/domain/model/profile/profile';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { ProfileDocument } from '../schema/profile.schema';

/**
 * Profile Mongo repository implementation
 */
@Injectable()
export class ProfileRepository implements IRepository<Profile> {

    constructor(
        @InjectModel('Profile')
        private readonly profileModel: Model<ProfileDocument>,
    ) { }
   

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Profile[]> {
        let arrayDoc: ProfileDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.profileModel.find({}).sort(mysort).skip(gap).limit(limit).exec();
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.profileModel.find({}).exec();
        }

        return this.castArrayDocToUser(arrayDoc);
        //return this.conversorArrayDocToCategory(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Profile[]> {
        let arrayDoc: ProfileDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | {$meta: "textScore"}> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.profileModel.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.profileModel.find(query).exec();
        }

        return this.castArrayDocToUser(arrayDoc);
    }

    async findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        let arrayDoc: ProfileDocument[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            let mysort = {}; 
            mysort[orderByField] = isAscending? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.profileModel.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.profileModel.find(query).exec();
        }

        return this.castArrayDocToUser(arrayDoc);
    };

    async getById(id: string, fieldsToExclude?: any): Promise<Profile> {
        if (fieldsToExclude) {
            const profileDoc: ProfileDocument = await this.profileModel.findById(id, fieldsToExclude).exec();
            //Doc has id name "_id"
            const objCasted: Profile = new Profile(profileDoc);
            return objCasted;
        }
        const profileDoc: ProfileDocument = await this.profileModel.findById(id).exec();
        //Doc has id name "_id"
        const objCasted: Profile = new Profile(profileDoc);
        return objCasted;
    };

    async getByQuery(query: any, fieldsToExclude?: any): Promise<Profile> {
        if (fieldsToExclude) {
            const profileDoc: ProfileDocument =  await this.profileModel.findOne(query, fieldsToExclude);
            const objCasted: Profile =  new Profile(profileDoc);
            return objCasted;
        }
        const profileDoc: ProfileDocument =  await this.profileModel.findOne(query);
        const objCasted: Profile = new Profile(profileDoc);
        return objCasted;
    }

    async hasById(id: string): Promise<boolean> {
        const profileDoc: ProfileDocument = await this.profileModel.findById(id).exec();
        if (!profileDoc) return false;
        return true;
    }

    async hasByQuery(query: any): Promise<boolean> {
        const profileDoc: ProfileDocument =  await this.profileModel.findOne(query);
        if (!profileDoc) return false;
        return true;
    }

    async create(doc: Profile): Promise<Profile> {
        const docCreated: ProfileDocument = await this.profileModel.create(doc);
        const objCasted: Profile = new Profile(docCreated);
        return objCasted;
    }

    async updateById(id: string, doc: any): Promise<boolean> {
        const docUpdated: ProfileDocument = await this.profileModel.findByIdAndUpdate(id, doc, {useFindAndModify: false}).exec();
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
        const docUpdated: ProfileDocument = await this.profileModel.findOneAndUpdate(query, valuesToSet, {useFindAndModify: false}).exec();
        return !!docUpdated;
    };


    async delete(id: string): Promise<boolean> {
        //Replace remove() with deleteOne() or deleteMany().
        const docDeleted = await this.profileModel.findByIdAndDelete(id, {useFindAndModify: false}).exec();
        return !!docDeleted; //doc is not null
    };

    /**
     * Convert Unmarshalled structure data (documents from Mongo) to Domain Object Structure (Domain classes)
     * @param schemaDocArray Unmarshalled structure data (documents from Mongo)
     * @returns Domain Object Structure (Domain classes)
     */
    castArrayDocToUser(schemaDocArray: ProfileDocument[]): Profile[] {
        let entityArray: Profile[] = [];
        schemaDocArray.forEach(element => entityArray.push(
            new Profile(element)
        ));
        return entityArray;
    };

    async count(query: any): Promise<number>{
        return await this.profileModel.count(query,);
     };

}