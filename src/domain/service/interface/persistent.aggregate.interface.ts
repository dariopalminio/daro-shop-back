export interface IPersistentAggregateService<T> {
      getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>;
      find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Array<T>>; 
      getById(id: string): Promise<T>;
      create<R>(doc: R | T): Promise<boolean>;
      updateById<R>(id: string, doc: R | T): Promise<boolean>;
      delete(id: string): Promise<boolean>;
      getByQuery(query: any): Promise<T>;
      hasById(id: string): Promise<boolean>;
      hasByQuery(query: any): Promise<boolean>;
      update(query: any, valuesToSet: any): Promise<boolean>;
    };

