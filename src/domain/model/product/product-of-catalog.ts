/**
 * ProductOfCatalog Compound Value Object (Product Item for Catalog)
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class ProductOfCatalog {
    _id: String;
    sku:  String;
    name: string;
    description: string;
    images: string[];
    category: string;
    grossPrice: number;
    stock: number;
};
