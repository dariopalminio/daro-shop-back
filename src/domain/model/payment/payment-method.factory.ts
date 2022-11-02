
import { IEntityFactory } from "../entity-factory.interface";
import { PaymentMethod } from "./payment-metod";

export class PaymentMethodEntityFactory implements IEntityFactory<PaymentMethod> {
    createInstance(unmarshalled: any): PaymentMethod {
        return new PaymentMethod(unmarshalled);
    }
}