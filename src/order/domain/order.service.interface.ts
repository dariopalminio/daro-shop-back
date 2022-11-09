import { Order } from 'src/order/domain/model/order';
import { IPersistentAggregateService } from "hexa-three-levels";

/**
 * Order Service Interface
 * 
 * Note: Services interfaces are fachade of 'use cases' that are the abstract definition of what the user would like to do in your application.  
 * All the business/domain logic and validations are happening in the use of case classes such as services. This interface works as input port. 
 * An input port (driving port) lets the application core (Domain layer) to expose the functionality to the outside of the world (app layer).
 * Application layer controllers use services only through these interfaces (input port).
 */
export interface IOrderService<T> extends IPersistentAggregateService<T> {
   
    initialize(orderNew: Order): Promise<Order>;
    confirm(orderId: string): Promise<boolean>;
    abort(orderId: string): Promise<boolean>;
    completePayment(orderId: string): Promise<boolean>;
    
};