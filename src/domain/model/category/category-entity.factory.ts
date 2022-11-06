import { IEntityFactory } from "hexa-three-levels";
import { Category } from "./category";

export class CategoryEntityFactory implements IEntityFactory<Category> {
    createInstance(unmarshalled: any): Category {
        return new Category(unmarshalled);
    }
}