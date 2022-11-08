import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../../domain/model/product/product';
import { ProductDocument } from '../schema/product.schema';
import { IRepository } from "hexa-three-levels";
import { MongoGenericRepository } from "hexa-three-levels";
import { ProductEntityFactory } from 'src/domain/model/product/product.factory';

/**
 * Product Mongo repository implementation
 */
 @Injectable()
 export class ProductRepository extends MongoGenericRepository<ProductDocument, Product> implements IRepository<Product> {
 
     constructor(
         @InjectModel('Product')
         productModel: Model<ProductDocument>,
     ) { 
         super(productModel, new ProductEntityFactory());
     }
 
 };

