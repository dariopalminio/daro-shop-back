import { Product } from "src/domain/model/product/product";
import { IRepository } from "hexa-three-levels";

// Mocking repository
export class ProductRepositoryNegativeStub implements IRepository<Product> {
    findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    count(query: any): Promise<number> {
        throw new Error('Method not implemented.');
    }
    async getAll(): Promise<Product[]> {
        return [];
    };
    async find(query: any): Promise<Product[]> {
        return [];
    }
    async getById(id: string): Promise<Product> {
        throw new Error();
    };
    async getByQueryExcludingFields(query: any, fieldsToExclude: any): Promise<any> {
        return null;
    };
    async getByQuery(query: any): Promise<Product> {
         throw new Error();
    }
    async hasById(id: string): Promise<boolean> {
        return false;
    }
    async hasByQuery(query: any): Promise<boolean> {
        return false;
    }
    async create<IProduct>(product: IProduct): Promise<Product> {
        throw new Error();
    };
    async updateById(id: string, product: Product): Promise<boolean> {
        throw new Error();
    };
    async update(query: any, valuesToSet: any): Promise<boolean> {
        return false;
    };
    async delete(id: string): Promise<boolean> {
        return false;
    };
};