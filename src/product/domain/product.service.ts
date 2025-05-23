import { Injectable, Inject } from '@nestjs/common';
import { IProductService } from 'src/product/domain/product.service.interface';
import { ProductOfCatalog } from 'src/product/domain/model/product-of-catalog';
import { Reservation } from 'src/product/domain/model/reservation';
import { Product } from 'src/product/domain/model/product.entity';
import { ProductDuplicateError, DuplicateSkuError, ProductFormatError, ProductNotFoundError, SkuGenerationError } from './product-errors';
import { IRepository, PaginatedResult, DomainError, ErrorCode } from "hexa-three-levels";

/**
 * Product Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity Root) and 
 * its collections, as in this case the 'Product' and Products collection in database.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class ProductService implements IProductService<Product> {

  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IRepository<Product>,
  ) { }

  searchExcludingFields(queryFilter: any, fieldsToExclude: any, page: number, limit: number, orderByField: string, isAscending: boolean): Promise<PaginatedResult<any>> {
    throw new Error('Method not implemented.');
  }
  
  findExcludingFields(query: any, fieldsToExclude: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  
  
  search(queryFilter?: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<PaginatedResult<Product>> {
    throw new Error('Method not implemented.');
  };

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Product[]> {
    const list: Product[] = await this.productRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async getAllActives(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Product[]> {
    const list: Product[] = await this.productRepository.find({ active: "true" }, page, limit, orderByField, isAscending);
    return list;
  };

  /**
   * Get Catalog
   */
  async getCatalog(category: string, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<PaginatedResult<any>> {
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

    const docs: any[] = await this.productRepository.findExcludingFields(queryQuilter, fieldsToExclude, page, limit, orderByField, isAscending);

    //Convert to ProductOfCatalog array
    let products: ProductOfCatalog[] = [];
    docs.forEach(element => products.push(
      new ProductOfCatalog(element)
    ));

    //compose result
    let filtered: PaginatedResult<any> = new PaginatedResult<any>();
    const count = await this.productRepository.count(queryQuilter);
    filtered.list = products;
    filtered.page = page ? page : 1;
    filtered.limit = limit ? limit : count;
    filtered.count = count;

    return filtered;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Product[]> {
    const list: Product[] = await this.productRepository.find(query, page, limit, orderByField, isAscending);
    return list;
  };

  async getById(id: string): Promise<Product> {
    const entity: Product = await this.productRepository.getById(id);
    if (!entity || entity === null) throw new ProductNotFoundError();
    return entity;
  };

  async getDetailById(id: string): Promise<any> {

    const fieldsToExclude = {
      netCost: 0,
      ivaAmountOnCost: 0,
      grossCost: 0,
      netPrice: 0,
      ivaAmountOnPrice: 0,
    };

    let obj: any = await this.productRepository.getByQueryExcludingFields({ _id: id }, fieldsToExclude);

    if (!obj || obj === null) throw new ProductNotFoundError();

    return obj;
  };

  async create<IProduct>(productDTO: IProduct): Promise<Product> {
    let newProduct: Product;
    try {
      newProduct = new Product(productDTO);
    } catch (error) {
      throw new ProductFormatError('Product data malformed:' + error.message);
    }
    let entityNew: Product;
    try {
      entityNew = await this.productRepository.create(newProduct);
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new ProductDuplicateError(`Database error: Duplicate key error collection or index problem. ${error.message}`);
      }
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, '', error);
    }
    return entityNew;
  };

  async delete(id: string): Promise<boolean> {
    const found: boolean = await this.productRepository.hasById(id);
    if (!found) throw new ProductNotFoundError();
    const deleted: boolean = await this.productRepository.delete(id);
    return deleted;
  };

  async updateById<IProduct>(id: string, productDTO: IProduct): Promise<boolean> {
    let modifiedProduct: Product;
    try {
      modifiedProduct = new Product(productDTO);
    } catch (error) {
      throw new ProductFormatError('Product data malformed:' + error.message);
    }

    const found: boolean = await this.productRepository.hasById(id);
    if (!found) {
      throw new ProductNotFoundError();
    }

    const updatedProduct: boolean = await this.productRepository.updateById(id, modifiedProduct);
    if (!updatedProduct) throw new Error("Could not update the indicated product.");
    return updatedProduct;
  };

  async getByQuery(query: any): Promise<Product> {
    const product = await this.productRepository.getByQuery(query);
    return product;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.productRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    if (!updatedProduct) throw new ProductNotFoundError();
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
    if (alreadyExists) throw new DuplicateSkuError("Failed because another product already has the same sku generated.");
    return skuGenerated;
  };

  generateAnySKU(type: string, brand: string, model: string, color: string, size: string, numberRange: number): string {
    if (!type || !brand || !model || !color || !size)
      throw new SkuGenerationError("Failed to generate SKU because type, brand, model, color or size attribute is null or not exist!");
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
    let reserva: Reservation = new Reservation(orderId, quantity, new Date());
    let product: Product = await this.getById(productId);
    product.addReservation(reserva);
    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

  async revertStockReservation(productId: string, orderId: string): Promise<boolean> {
    let product: Product = await this.getById(productId);
    product.revertReservationAndUpdateStock(orderId);
    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

  async concreteReservationBySale(productId: string, orderId: string): Promise<boolean> {
    let product: Product = await this.getById(productId);
    product.removeReservation(orderId);
    const updated: boolean = await this.updateById(productId, product);
    return updated;
  }

};
