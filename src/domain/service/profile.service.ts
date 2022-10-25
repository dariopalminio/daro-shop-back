import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../infra-interface/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IProfileService } from './interface/profile.service.interface';
import { Profile } from '../model/profile/profile';

/**
 * Profile Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'Profile' and Profiles collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class ProfileService implements IProfileService<Profile> {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IRepository<Profile>) {
  }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Profile[]> {
    const list: Profile[] = await this.profileRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<Profile[]> {
    const list: Profile[] = await this.profileRepository.find(query, page, limit, orderByField, isAscending);
    return list;
  };

  async getById(id: string): Promise<Profile> {
    const entity: Profile = await this.profileRepository.getById(id);
    return entity;
  };

  async create(userRegisterDTO: Profile): Promise<Profile> {
    try {
      let newProf: Profile = new Profile();
      newProf.userId = userRegisterDTO.userId;
      newProf.userName = userRegisterDTO.userName;
      newProf.email = userRegisterDTO.email;
      newProf.firstName = userRegisterDTO.firstName;
      newProf.lastName = userRegisterDTO.lastName;
      newProf.docType = userRegisterDTO.docType,
      newProf.document = userRegisterDTO.document,
      newProf.telephone = userRegisterDTO.telephone,
      newProf.language = userRegisterDTO.language,
      newProf.addresses = userRegisterDTO.addresses,
      newProf.enable = true;
      const entityNew: Profile = await this.profileRepository.create(newProf);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          throw new DomainError(409, error.message, error, 'Duplicate key error collection or index problem.');
        default:
          throw new DomainError(500, error.message, error); //Internal server error
      }
    }
  };

  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.profileRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, profile: Profile): Promise<boolean> {
    const updated: boolean = await this.profileRepository.updateById(id, {...profile, updatedAt: new Date()});
    return updated;
  };

  async getByUserName(userName: string): Promise<Profile> {
    const query = {userName: userName};
    const user = await this.profileRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<Profile> {
    const entity = await this.profileRepository.getByQuery(query);
    return entity;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updated: boolean = await this.profileRepository.update(query, {...valuesToSet, updatedAt: new Date()});
    return updated;
  };

  async updateProfile(userProfileDTO: any): Promise<boolean> {
    const query = {userName: userProfileDTO.userName};
    const valuesToSet = userProfileDTO;
    const updated: boolean = await this.profileRepository.update(query, {...valuesToSet, updatedAt: new Date});
    return updated;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.profileRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.profileRepository.hasByQuery(query);
  };

    /**
   * Factory method
   * @param dto dto any object
   * @returns  profile object instance
   */
     makeEntityFromAny(dto: any): Profile {
      let entity: Profile = new Profile();
      entity.setFromAny(dto);
      return entity;
    };

};
