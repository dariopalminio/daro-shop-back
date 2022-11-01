/**
 * Repository Interface
 * 
 * Generic interface for your Repository.
 * 
 * Note 1: The simplest approach of Repository Pattern, especially with an existing system, is to create a new Repository 
 * implementation for each business object you need to store to or retrieve from your infrastructure persistence layer.
 * Essentially, it provides an abstraction of data, so that your application can work with a simple abstraction that has an interface approximating that of a collection. 
 * Using this pattern can help achieve loose coupling and can keep domain objects persistence ignorant. 
 * Note 2: This interface works as output port. An output port (driven port) is another type of interface that is used by the application core 
 * to reach things outside of itself (like getting some data from a database).
 */
export interface IRepository<T> {

    getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>;
    find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>; 
    getById(id: string, fieldsToExclude?: any): Promise<T>;
    getByQueryExcludingFields(query: any, fieldsToExclude: any): Promise<any>;
    getByQuery(query: any): Promise<T>;
    hasById(id: string): Promise<boolean> ;
    hasByQuery(query: any): Promise<boolean>;
    create(doc: T): Promise< T>;
    updateById<R>(entityId: string, doc: R | T): Promise<boolean>;
    update(query: any, valuesToSet: any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]>;
    count(query: any): Promise<number>;
    
  }
