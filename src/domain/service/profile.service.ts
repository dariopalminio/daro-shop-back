import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from 'src/domain/outgoing/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { IProfileService } from 'src/domain/incoming/profile.service.interface';
import { Profile } from 'src/domain/model/profile/profile';
import { ResponseCode } from 'src/domain/error/response-code.enum';
import { DuplicateProfileError } from '../error/profile-errors';

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

  async create(profileRegister: Profile): Promise<Profile> {
    try {
      profileRegister.setEnable(true);
      const entityNew: Profile = await this.profileRepository.create(profileRegister);
      return entityNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      if (error.code && error.code === 11000) {
          throw new DuplicateProfileError(`Database error: Duplicate key error collection or index problem. ${error.message}`);
      }
      throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, '', error); //Internal server error
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

};
