
import { IEntityFactory } from "../entity-factory.interface";
import { Product } from "./product";


export class ProductEntityFactory implements IEntityFactory<Product> {
    createInstance(unmarshalled: any): Product {
        return new Product(unmarshalled);
    }
};