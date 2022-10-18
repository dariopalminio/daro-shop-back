/**
 * Repository Interface
 * The simplest approach of Repository Pattern, especially with an existing system, is to create a new Repository 
 * implementation for each business object you need to store to or retrieve from your infrastructure persistence layer.
 */
export interface IRepository<T> {

  /**
   * Get all optionally with pagination and sorting
   * @param page 
   * @param limit 
   * @param orderByField 
   * @param isAscending 
   */
    getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>;
    find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>; 
    getById(id: string, fieldsToExclude?: any): Promise<T>;
    getByQuery(query: any, fieldsToExclude?: any): Promise<T>;
    hasById(id: string): Promise<boolean> ;
    hasByQuery(query: any): Promise<boolean>;
    create<R>(doc: R | T): Promise<string>;
    updateById<R>(id: string, doc: R | T): Promise<boolean>;
    update(query: any, valuesToSet: any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findExcludingFields(query: any, fieldsToExclude: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<any[]>;
    count(query: any): Promise<number>;
  }
