import { Model } from 'mongoose';
import { IEntityFactory } from 'src/domain/model/entity-factory.interface';
import { IMarshable } from 'src/domain/model/marshable.interface';
import { IRepository } from '../../../domain/outgoing/repository.interface';

/**
 * Product Mongo repository implementation
 */
export class GenericRepository<D, T extends IMarshable<T>> implements IRepository<T> {

    constructor(
        private readonly model: Model<D>,
        private factory: IEntityFactory<T>
    ) { }

    async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>> {
        let arrayDoc: D[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | { $meta: "textScore" }> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.model.find({}).sort(mysort).skip(gap).limit(limit).exec();
            //similar to arrayDoc.slice((page - 1) * limit, page * limit);
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.model.find({}).exec();
        }
        return this.castArrayDocToArrayDomainEntity(arrayDoc);
    };

    async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<T[]> {
        let arrayDoc: D[];

        if (page && limit && orderByField) {
            // All with pagination and sorting
            const direction: number = isAscending ? 1 : -1;
            //const mysort = [[orderByField, direction]];
            const mysort: Record<string, | 1 | -1 | { $meta: "textScore" }> = { reference: 1 };
            const gap: number = (page - 1) * limit;
            arrayDoc = await this.model.find(query).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.model.find(query).exec();
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
        let arrayDoc: D[];
        if (page && limit && orderByField) {
            // All with pagination and sorting
            let mysort = {};
            mysort[orderByField] = isAscending ? 1 : -1; //Record<string, | 1 | -1 | {$meta: "textScore"}>
            const gap = (page - 1) * limit;
            //skip method will skip the document as per the number which was we have used with the skip method.
            const ascending = 1;
            arrayDoc = await this.model.find(query, fieldsToExclude).sort(mysort).skip(gap).limit(limit).exec();
        } else {
            // All without pagination and without sorting
            arrayDoc = await this.model.find(query).exec();
        }

        return arrayDoc;
    };

    /**
     * getById
     * If it does not find it, it returns null
     */
    async getById(id: string, fieldsToExclude?: any): Promise<T> {
        if (fieldsToExclude) {
            const prodDoc: D = await this.model.findById(id, fieldsToExclude).exec();
            const objCasted: T = this.factory.createInstance(prodDoc);
            return objCasted;
        }
        const doc: D = await this.model.findById(id).exec();
        const objCasted: T = this.factory.createInstance(doc);
        return objCasted;
    };

    async getByQueryExcludingFields(query: any, fieldsToExclude: any): Promise<any> {
        const entereDocum: any = await this.model.findOne(query, fieldsToExclude);
        let onlyEntityDoc: any;
        if (entereDocum && entereDocum._doc && entereDocum._doc._id) {
            onlyEntityDoc = { ...entereDocum._doc, "id": entereDocum._doc._id }
        }
        return onlyEntityDoc;
    };

    async getByQuery(query: any): Promise<T> {
        const doc: D = await this.model.findOne(query);
        const objCasted: T = this.factory.createInstance(doc);
        return objCasted;
    };

    async hasById(id: string): Promise<boolean> {
        const prodDoc: D = await this.model.findById(id).exec();
        if (!prodDoc) return false;
        return true;
    };

    async hasByQuery(query: any): Promise<boolean> {
        const prodDoc: D = await this.model.findOne(query);
        if (!prodDoc) return false;
        return true;
    };

    async create(entity: T): Promise<T> {
        const docCreated: D = await this.model.create(entity);
        const objCasted: T = entity.createFromAny(docCreated);
        return objCasted;
    };

    async updateById(entityId: string, entity: T): Promise<boolean> {
        const unmarshalled: any = entity.convertToAny();
        const { id, ...values } = unmarshalled;
        const docUpdated: D = await this.model.findByIdAndUpdate(entityId, { ...values, updatedAt: new Date() }, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async update(query: any, valuesToSet: any): Promise<boolean> {
        const docUpdated: D = await this.model.findOneAndUpdate(query, valuesToSet, { useFindAndModify: false }).exec();
        return !!docUpdated;
    };

    async delete(id: string): Promise<boolean> {
        const docDeleted = await this.model.findByIdAndDelete(id, { useFindAndModify: false }).exec();
        return !!docDeleted; //doc is not null
    };

    /**
     * Convert Unmarshalled structure data (documents from Mongo) to Domain Object Structure (Domain classes)
     * @param schemaDocArray Unmarshalled structure data (documents from Mongo)
     * @returns Domain Object Structure (Domain classes)
     */
    castArrayDocToArrayDomainEntity(schemaDocArray: D[]): T[] {
        let domainEntityArray: T[] = [];
        schemaDocArray.forEach(element => domainEntityArray.push(
            this.factory.createInstance(element)
        ));
        return domainEntityArray;
    };

    async count(query: any): Promise<number> {
        return await this.model.count(query,);
    };

};

