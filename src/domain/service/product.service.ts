import { Injectable, Inject } from '@nestjs/common';
import { IProductService } from '../service/interface/product.service.interface';
import { IProduct } from 'src/domain/model/product/product.interface';
import { IRepository } from '../output-port/repository.interface';
import { ProductItemDTO } from 'src/domain/model/product/product-item.dto';
import { FilteredProductsDTO } from 'src/domain/model/product/filtered-products.dto';
import { Reservation } from '../model/product/reservation';
import { Sale } from '../model/product/sale';


@Injectable()
export class ProductService implements IProductService<IProduct> {

  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IRepository<IProduct>,
  ) { }


  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProduct[]> {
    const list: IProduct[] = await this.productRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async getAllActives(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProduct[]> {
    const list: IProduct[] = await this.productRepository.find({ active: "true" }, page, limit, orderByField, isAscending);
    return list;
  };

  /**
   * Get Catalog
   */
  async getCatalog(category: string, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<FilteredProductsDTO> {
    const fieldsToExclude = {
      barcode: 0,
      type: 0,
      brand: 0,
      color: 0,
      model: 0,
      gender: 0,
      size: 0,
      netCost: 0,
      ivaAmountOnCost: 0,
      grossCost: 0,
      netPrice: 0,
      ivaAmountOnPrice: 0,
      active: 0,
      __v: 0
    };
    let queryQuilter;
    if (category.trim() === '') queryQuilter = { active: "true" };
      else queryQuilter = { category: category, active: "true" };
    const products: ProductItemDTO[] = await this.productRepository.findExcludingFields(queryQuilter, fieldsToExclude, page, limit, orderByField, isAscending);
    let filtered: FilteredProductsDTO = new FilteredProductsDTO();
    filtered.list = products;
    filtered.page = page;
    filtered.limit = limit;
    filtered.count = await this.productRepository.count(queryQuilter);
    return filtered;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProduct[]> {
    const list: IProduct[] = await this.productRepository.find(query, page, limit, orderByField, isAscending);
    return list;
  };

  async getById(id: string): Promise<IProduct> {
    const entity: IProduct = await this.productRepository.getById(id);
    return entity;
  };

  async getDetailById(id: string): Promise<IProduct> {
    const fieldsToExclude = {
      netCost: 0,
      ivaAmountOnCost: 0,
      grossCost: 0,
      netPrice: 0,
      ivaAmountOnPrice: 0,
    };

    const entity: IProduct = await this.productRepository.getById(id, fieldsToExclude);
    return entity;
  };

  async create(product: IProduct): Promise<IProduct> {
    const entityNew: Promise<IProduct> = this.productRepository.create(product);
    return entityNew;
  };

  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.productRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, product: IProduct): Promise<boolean> {
    const updatedProduct: boolean = await this.productRepository.updateById(id, { ...product, updatedAt: new Date() });
    return updatedProduct;
  };

  async getByQuery(query: any): Promise<IProduct> {
    const product = await this.productRepository.getByQuery(query);
    return product;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.productRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.productRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.productRepository.hasByQuery(query);
  };

  /**
   * Generate a unique Stock Keeping Unit
   */
  async generateSKU(type: string, brand: string, model: string, color: string, size: string): Promise<string> {
    const maxNumber = 1000;
    let attemps = 0;
    let alreadyExists: boolean = true;
    let skuGenerated: string;
    do {
      attemps = attemps + 1;
      skuGenerated = this.generateAnySKU(type, brand, model, color, size, maxNumber);
      alreadyExists = await this.productRepository.hasByQuery({ sku: skuGenerated });
    } while ((alreadyExists) && (attemps < maxNumber));
    if (alreadyExists) throw new Error("Failed to generate unique SKU!");
    return skuGenerated;
  };

  generateAnySKU(type: string, brand: string, model: string, color: string, size: string, numberRange: number): string {
    if (!type || !brand || !model || !color || !size)
      throw new Error("Failed to generate SKU because empty attribute!");
    const separator = "-";
    let firstStr = type.substring(0, 4);
    let secondStr = brand.substring(0, 3);
    let thirdStr = model.substring(0, 3);
    let fourthStr = color.substring(0, 3);
    let fifthStr = size.substring(0, 2);
    let SixStr = Math.floor(Math.random() * numberRange);
    let sku = firstStr + separator + secondStr + separator + thirdStr + separator + fourthStr + separator + fifthStr + separator + SixStr;
    sku = sku.toUpperCase();
    return sku;
  };

  async addStockReservation(productId: string, orderId: string, quantity: number): Promise<boolean> {
    let reserva: Reservation = new Reservation();
    reserva.orderId = orderId;
    reserva.quantity = quantity;
    reserva.date = new Date();
    let product: IProduct = await this.getById(productId);
    if (quantity > product.stock)
      throw new Error(`Insufficient stock. In orderId ${orderId} try to reserve quantity ${quantity} when there is ${product.stock} in stock`);
    product.stock -= reserva.quantity;
    product.reservations.push(reserva);
    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

  async revertStockReservation(productId: string, orderId: string): Promise<boolean> {
    let product: IProduct = await this.getById(productId);
    const reserveIndex = product.reservations.findIndex((reservation) => reservation.orderId === orderId);
    if (reserveIndex === -1)
      throw new Error(`Not found ${orderId} in reservation list of product ${productId}`);
    const qty = product.reservations[reserveIndex].quantity;
    product.stock += qty;

    const newReservationList = [
      ...product.reservations.slice(0, reserveIndex),
      ...product.reservations.slice(reserveIndex + 1),
    ];

    product.reservations = newReservationList;

    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

  async moveReservationToSale(productId: string, orderId: string): Promise<boolean> {
    let product: IProduct = await this.getById(productId);
    const reserveIndex = product.reservations.findIndex((reservation) => reservation.orderId === orderId);
    const reservation : Reservation = product.reservations[reserveIndex];

    const newReservationList = [
      ...product.reservations.slice(0, reserveIndex),
      ...product.reservations.slice(reserveIndex + 1),
    ];

    product.reservations = newReservationList;

    let newSale: Sale = new Sale();
    newSale.orderId = reservation.orderId;
    newSale.quantity = reservation.quantity;
    newSale.grossPrice = product.grossPrice;
    newSale.date = new Date();
    product.sales.push(newSale);

    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

};
