import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { Address } from '../model/profile/address';
import { IOrderService } from './interface/order.service.interface';
import { IOrder } from '../model/order/order.interface';
import { Order } from '../model/order/order';
import { IProductService } from './interface/product.service.interface';
import { IProduct } from '../model/product/product.interface';
import { IShippingPriceService } from './interface/shipping-price.service.interface';
import { IShippingPrice } from '../model/shipping/shipping-price.interface';
import { OrderItem } from '../model/order/order-item';
import { OrderStatus } from '../model/order/order-status.enum';
import { ResponseCode } from '../model/service/response.code.enum';
import { IOrderItem } from '../model/order/order-item.interface';


@Injectable()
export class OrderService implements IOrderService<IOrder> {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IRepository<IOrder>,
    @Inject('IShippingPriceService')
    private readonly shippingPriceService: IShippingPriceService<IShippingPrice>,
    @Inject('IProductService')
    private readonly productService: IProductService<IProduct>,
  ) { }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
    const list: IOrder[] = await this.orderRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IOrder[]> {
    const entity: IOrder[] = await this.orderRepository.find(query, page, limit, orderByField, isAscending);
    return entity;
  };

  async getById(id: string): Promise<IOrder> {
    const user: IOrder = await this.orderRepository.getById(id);
    return user;
  };

  async create(orderNew: IOrder): Promise<IOrder> {
    try {
      let newObj: Order = new Order();
      newObj.client = orderNew.client;
      newObj.orderItems = orderNew.orderItems;
      newObj.count = orderNew.count;
      newObj.includesShipping = orderNew.includesShipping;
      newObj.shippingAddress = orderNew.shippingAddress;
      newObj.subTotal = orderNew.subTotal;
      newObj.shippingPrice = orderNew.shippingPrice;
      newObj.total = orderNew.total;

      const entityNew: IOrder = await this.orderRepository.create(newObj);
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
  async initialize(orderParam: IOrder): Promise<IOrder> {

    let newObj: Order = new Order();
    newObj.client = orderParam.client;
    newObj.orderItems = [];
    newObj.count = 0;
    newObj.includesShipping = orderParam.includesShipping;
    newObj.shippingAddress = orderParam.shippingAddress;
    newObj.subTotal = 0;
    newObj.shippingPrice = 0;
    newObj.total = 0;

    //Calculate amounts
    for (let i = 0; i < orderParam.orderItems.length; i++) {
      const item: IOrderItem = orderParam.orderItems[i];
      const product: IProduct = await this.productService.getById(item.productId);
      if (orderParam.orderItems[i].quantity > product.stock)
        throw new DomainError(500, 'There is no stock of the product', { productId: item.productId });
      const newAmount: number = product.grossPrice * item.quantity;
      const newItem = new OrderItem(item.productId, item.imageUrl, product.name, product.grossPrice, item.quantity, newAmount);
      newObj.orderItems.push(newItem);
      newObj.count += item.quantity;
    }

    //Calculate subtotals
    let subTotalVal: number = 0;
    for (let i = 0; i < newObj.orderItems.length; i++) {
      subTotalVal += Number(newObj.orderItems[i].amount);
    }
    newObj.subTotal = Number(subTotalVal.toFixed(2));

    //Calculate total with shipping price
    newObj.shippingPrice = 0;
    if (newObj.includesShipping) {
      const pricing: any = await this.shippingPriceService.getPriceByAddress(newObj.shippingAddress);
      console.log("pricing:", pricing);
      if (!pricing || !pricing.price)
        throw new DomainError(500, 'No price found for delivery to the indicated address', { address: newObj.shippingAddress });
      newObj.shippingPrice = Number(pricing.price);
    }
    newObj.total = Number((subTotalVal + 0.0 + newObj.shippingPrice).toFixed(2));

    try {
      const entityNew: IOrder = await this.orderRepository.create(newObj);
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

  async confirm(orderId: string): Promise<boolean> {
    //you must reserve quantity in the products of each order items and set status to CONFIRMED
    try {
      const order: IOrder = await this.getById(orderId);

      //validate that the stock is sufficient to full order
      for (let i = 0; i < order.orderItems.length; i++) {
        let product: IProduct = await this.productService.getById(order.orderItems[i].productId);
        if (order.orderItems[i].quantity > product.stock)
          throw new Error(`Insufficient stock for order ${orderId}.`);
      }

      //add reservations in products indicated in order
      for (let i = 0; i < order.orderItems.length; i++) {
        await this.productService.addStockReservation(order.orderItems[i].productId, orderId, order.orderItems[i].quantity);
      }

      //change order status
      const confirmed: boolean = await this.update({ _id: orderId }, { status: OrderStatus.CONFIRMED });
      return confirmed;
    } catch (error) {
      console.log("Order confirm error:", error);
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, { error: error.message });
    }
  };

  async abort(orderId: string): Promise<boolean> {
    try {
      const order: IOrder = await this.getById(orderId);

      //revert reservations in products indicated in order
      for (let i = 0; i < order.orderItems.length; i++) {
        await this.productService.revertStockReservation(order.orderItems[i].productId, orderId);
      }

      //change order status
      const aborted: boolean = await this.update({ _id: orderId }, { status: OrderStatus.ABORTED });
      return aborted;
    } catch (error) {
      console.log("Order abort error:", error);
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, { error: error.message });
    }
  }

  async completePayment(orderId: string): Promise<boolean> {
    //you must register the sale effectively discounting the stock
    try {
      const order: IOrder = await this.getById(orderId);

      for (let i = 0; i < order.orderItems.length; i++) {
        await this.productService.moveReservationToSale(order.orderItems[i].productId, orderId);
      }

      const paid: boolean = await this.update({ _id: orderId }, { status: OrderStatus.PAID });
      return paid;
    } catch (error) {
      console.log("Order completePayment error:", error);
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, { error: error.message });
    }
  };

  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.orderRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, order: IOrder): Promise<boolean> {
    const updated: boolean = await this.orderRepository.updateById(id, { ...order, updatedAt: new Date() });
    return updated;
  };

  async getByUserName(userName: string): Promise<IOrder> {
    const query = { userName: userName };
    const user = await this.orderRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IOrder> {
    const user = await this.orderRepository.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.orderRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.orderRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.orderRepository.hasByQuery(query);
  };

};
