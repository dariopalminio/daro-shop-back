import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { Product } from '../../../domain/model/product/product';
import { ProductDocument } from '../schema/product.schema';
import { FormatError, IdFormatError } from 'src/domain/error/domain-error';
import { GenericRepository } from './generic-repository';
import { ProductEntityFactory } from 'src/domain/model/product/product.factory';

/**
 * Product Mongo repository implementation
 */
 @Injectable()
 export class ProductRepository extends GenericRepository<ProductDocument, Product> implements IRepository<Product> {
 
     constructor(
         @InjectModel('Product')
         productModel: Model<ProductDocument>,
     ) { 
         super(productModel, new ProductEntityFactory());
     }
 
 };

