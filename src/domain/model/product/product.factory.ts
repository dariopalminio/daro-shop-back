
import { IEntityFactory } from "hexa-three-levels";
import { Product } from "./product";


export class ProductEntityFactory implements IEntityFactory<Product> {
    createInstance(unmarshalled: any): Product {
        return new Product(unmarshalled);
    }
};