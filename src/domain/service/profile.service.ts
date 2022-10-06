import { Injectable, Inject } from '@nestjs/common';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { UserProfileDTO } from 'src/domain/model/profile/user-profile.dto.type';
import { IProfile } from '../model/profile/profile.interface';
import { IProfileService } from './interface/profile.service.interface';
import { Profile } from '../model/profile/profile';

@Injectable()
export class ProfileService implements IProfileService<IProfile> {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IRepository<IProfile>) {
  }

  // Get all
  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProfile[]> {
    const users: IProfile[] = await this.profileRepository.getAll(page, limit, orderByField, isAscending);
    return users;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IProfile[]> {
    const users: IProfile[] = await this.profileRepository.find(query, page, limit, orderByField, isAscending);
    return users;
  };

  // Get a single
  async getById(id: string): Promise<IProfile> {
    const user: IProfile = await this.profileRepository.getById(id);
    return user;
  };

  //Create new user with basic data
  async create(userRegisterDTO: IProfile): Promise<boolean> {
    try {
      let newProf: IProfile = new Profile();
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

      const newCat: boolean = await this.profileRepository.create(newProf);
      console.log(newCat);
      return newCat;
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

  // Delete user return this.labelModel.deleteOne({ osCode }).exec();
  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.profileRepository.delete(id);
    return deleted;
  };

  // Put a single user
  async updateById(id: string, user: IProfile): Promise<boolean> {
    const updatedUser: boolean = await this.profileRepository.updateById(id, user);
    return updatedUser;
  };

  async getByUserName(userName: string): Promise<IProfile> {
    const query = {userName: userName};
    const user = await this.profileRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IProfile> {
    const user = await this.profileRepository.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.profileRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async updateProfile(userProfileDTO: UserProfileDTO): Promise<boolean> {
    const query = {userName: userProfileDTO.userName};
    const valuesToSet = userProfileDTO;
    const updatedProduct: boolean = await this.profileRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.profileRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.profileRepository.hasByQuery(query);
  };

};
