/**
 * PaginatedResult Value Object
 * Search result with pagination.
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class PaginatedResult {
    page:  number; //current page
    limit: number; //The limit is used to specify the maximum number of results to be returned by page or page size.
    count: number; //Total entities or documents in the database that meet the condition --> count / limit = quantity of pages
    list: any[]; //Array with length = limit
};
