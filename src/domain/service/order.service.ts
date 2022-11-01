import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from 'src/domain/outgoing/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IOrderService } from 'src/domain/incoming/order.service.interface';
import { Order } from 'src/domain/model/order-aggregate/order';
import { IProductService } from 'src/domain/incoming/product.service.interface';
import { IShippingPriceService } from 'src/domain/incoming/shipping-price.service.interface';
import { OrderItem } from 'src/domain/model/order-aggregate/order-item';
import { OrderStatus } from 'src/domain/model/order-aggregate/order-status.enum';
import { ErrorCode } from 'src/domain/error/error-code.enum';
import { ShippingPrice } from 'src/domain/model/shipping/shipping-price';
import { Product } from 'src/domain/model/product/product';
import { OrderDuplicateError, OrderFormatError, OrderNotFoundError, OutOfStockError } from '../error/order-errors';

/**
 * Order Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'Order' and Orders collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain objects or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class OrderService implements IOrderService<Order> {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IRepository<Order>,
    @Inject('IShippingPriceService')
    private readonly shippingPriceService: IShippingPriceService<ShippingPrice>,
    @Inject('IProductService')
    private readonly productService: IProductService<Product>,
  ) { }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Order[]> {
    const list: Order[] = await this.orderRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Order[]> {
    const entity: Order[] = await this.orderRepository.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  async getById(id: string): Promise<Order> {
    const user: Order = await this.orderRepository.getById(id);
    return user;
  };

  async create<IOrder>(orderDTO: IOrder): Promise<Order> {
    let orderEntity: Order;
    try {
      orderEntity = new Order(orderDTO);
    } catch (error) {
      throw new OrderFormatError('Order data malformed: ' + error.message);
    }
    try {
      const entityNew: Order = await this.orderRepository.create(orderEntity);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new DomainError(409, error.message, error);
        default:
          //Internal server error
          throw new DomainError(500, error.message, error);
      }
    }
  };

  /**
   * Create & initialize an order
   */
  async initialize(orderParam: Order): Promise<Order> {

    let ordenNew: Order = new Order(orderParam);
    ordenNew.setClient(orderParam.getClient());
    ordenNew.setOrderItems([]);
    ordenNew.setCount(0);
    ordenNew.setIncludesShipping(orderParam.getIncludesShipping());
    ordenNew.setShippingAddress(orderParam.getShippingAddress());
    ordenNew.setSubTotal(0);
    ordenNew.setShippingPrice(0);
    ordenNew.setTotal(0);

    //Calculate amounts
    for (let i = 0; i < orderParam.getOrderItems().length; i++) {
      const item: OrderItem = orderParam.getOrderItems()[i];
      const product: Product = await this.productService.getById(item.getProductId());
      if (orderParam.getOrderItems()[i].getQuantity() > product.getStock())
        throw new OutOfStockError(`The product with id ${item.getProductId()} is out of stock`);
      const newAmount: number = product.getGrossPrice() * item.getQuantity();
      const newItem: OrderItem = new OrderItem(item.getProductId(), item.getImageUrl(), product.getName(), product.getGrossPrice(), item.getQuantity(), newAmount);
      ordenNew.addNewItem(newItem);
    }

    //Calculate subtotals
    let subTotalVal: number = 0;
    for (let i = 0; i < ordenNew.getOrderItems().length; i++) {
      subTotalVal += Number(ordenNew.getOrderItems()[i].getAmount());
    }
    ordenNew.setSubTotal(Number(subTotalVal.toFixed(2)));

    //Calculate total with shipping price
    ordenNew.setShippingPrice(0);
    if (ordenNew.getIncludesShipping()) {
      const pricing: any = await this.shippingPriceService.getPriceByAddress(ordenNew.getShippingAddress());
      console.log("pricing:", pricing);
      if (!pricing || !pricing.price)
        throw new OrderFormatError('No price found for delivery to the indicated address', { address: ordenNew.getShippingAddress() });
      ordenNew.setShippingPrice(Number(pricing.price));

    }
    ordenNew.setTotal(Number((subTotalVal + 0.0 + ordenNew.getShippingPrice()).toFixed(2)));

    try {
      const entityNew: Order = await this.orderRepository.create(ordenNew);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new OrderDuplicateError(error.message, error);
        default:
          //Internal server error
          throw new DomainError(500, error.message, error);
      }
    }
  };

  async confirm(orderId: string): Promise<boolean> {
    //you must reserve quantity in the products of each order items and set status to CONFIRMED
    let order: Order;
    try {
      order = await this.getById(orderId);
      if (!order) throw new Error();
    } catch (error) {
      throw new OrderNotFoundError();
    }
    //validate that the stock is sufficient to full order
    for (let i = 0; i < order.getOrderItems().length; i++) {
      const productId: string = order.getOrderItems()[i].getProductId();
      let product: Product = await this.productService.getById(productId);
      const qty: number = order.getOrderItems()[i].getQuantity();
      if (qty > product.getStock()) {
        throw new OutOfStockError(`Insufficient stock for order ${orderId}.`);
      }
    }

    try {
      //add reservations in products indicated in order
      for (let i = 0; i < order.getOrderItems().length; i++) {
        const productId: string = order.getOrderItems()[i].getProductId();
        const qty: number = order.getOrderItems()[i].getQuantity();
        await this.productService.addStockReservation(productId, orderId, qty);
      }

      //change order status
      const confirmed: boolean = await this.update({ _id: orderId }, { status: OrderStatus.CONFIRMED });
      return confirmed;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, 'Error in order confirmation.', { error: error.message });
    }
  };

  async abort(orderId: string): Promise<boolean> {
    let order: Order;
    try {
      order = await this.getById(orderId);
      if (!order) throw new Error();
    } catch (error) {
      throw new OrderNotFoundError();
    }

    try {
      //revert reservations in products indicated in order
      for (let i = 0; i < order.getOrderItems().length; i++) {
        const productId: string = order.getOrderItems()[i].getProductId();
        await this.productService.revertStockReservation(productId, orderId);
      }

      //change order status
      const aborted: boolean = await this.update({ _id: orderId }, { status: OrderStatus.ABORTED });
      return aborted;
    } catch (error) {
      console.log("Order abort error:", error);
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, 'Error in order aborting', { error: error.message });
    }
  }

  async completePayment(orderId: string): Promise<boolean> {
    //you must register the sale effectively discounting the stock
    let order: Order;
    try {
      order = await this.getById(orderId);
      if (!order) throw new Error();
    } catch (error) {
      throw new OrderNotFoundError();
    }
    try {
      for (let i = 0; i < order.getOrderItems().length; i++) {
        const productId: string = order.getOrderItems()[i].getProductId();
        await this.productService.concreteReservationBySale(productId, orderId);
      }

      const paid: boolean = await this.update({ _id: orderId }, { status: OrderStatus.PAID });
      return paid;
    } catch (error) {
      console.log("Order completePayment error:", error);
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, 'Error in complete payment.', { error: error.message });
    }
  };

  async delete(id: string): Promise<boolean> {

    const exist: boolean = await this.orderRepository.hasById(id);
    if (!exist) throw new OrderNotFoundError();

    const deleted: boolean = await this.orderRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, order: Order): Promise<boolean> {
    const exist: boolean = await this.orderRepository.hasById(id);
    if (!exist) throw new OrderNotFoundError();
    const updated: boolean = await this.orderRepository.updateById(id, order);
    if (!updated) throw new Error("Could not update the indicated order.");
    return updated;
  };

  async getByQuery(query: any): Promise<Order> {
    const order = await this.orderRepository.getByQuery(query);
    if (!order || order === null) throw new OrderNotFoundError();
    return order;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.orderRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    if (!updatedProduct) throw new OrderNotFoundError();
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.orderRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.orderRepository.hasByQuery(query);
  };

};
