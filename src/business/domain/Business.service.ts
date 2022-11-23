
import { IRepository, GenericService } from "hexa-three-levels";
import { Injectable, Inject } from '@nestjs/common';
import { IBusinessService } from './Business.service.interface';
import { Business, BusinessEntityFactory, IBusiness } from './Business.entity';

@Injectable()
export class BusinessService extends GenericService<IBusiness, Business> implements IBusinessService<Business> {

  constructor(
    @Inject('IBusinessRepository')
    repository: IRepository<Business>,
  ) { 
    super(repository, new BusinessEntityFactory());
  }

};
