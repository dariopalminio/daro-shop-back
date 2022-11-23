
    import { Injectable } from '@nestjs/common';
    import { InjectModel } from '@nestjs/mongoose';
    import { Model } from 'mongoose';
    import { IRepository } from "hexa-three-levels";
    import { BusinessDocument } from './Business.schema';
    import { MongoGenericRepository } from "hexa-three-levels";
    import { Business, BusinessEntityFactory } from './../domain/Business.entity';
    
    @Injectable()
    export class BusinessRepository extends MongoGenericRepository<BusinessDocument, Business> implements IRepository<Business> {
    
        constructor(
            @InjectModel('BusinessModel')
            model: Model<BusinessDocument>,
        ) { 
            super(model, new BusinessEntityFactory());
        }
    
    };
