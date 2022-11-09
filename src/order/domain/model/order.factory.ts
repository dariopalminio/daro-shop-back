
import { IEntityFactory } from "hexa-three-levels";
import { Order } from "./order";


export class OrderEntityFactory implements IEntityFactory<Order> {
    createInstance(unmarshalled: any): Order {
        return new Order(unmarshalled);
    }
};