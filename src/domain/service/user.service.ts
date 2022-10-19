import { Injectable, Inject } from '@nestjs/common';
import { IUserService } from '../service/interface/user.service.interface';
import { IUser } from 'src/domain/model/user/user.interface';
import { User } from 'src/domain/model/user/user';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';

@Injectable()
export class UserService implements IUserService<IUser> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IRepository<IUser>) {
  }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IUser[]> {
    const users: IUser[] = await this.userRepository.getAll(page, limit, orderByField, isAscending);
    return users;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<IUser[]> {
    const users: IUser[] = await this.userRepository.find(query, page, limit, orderByField, isAscending);
    return users;
  };

  async getById(id: string): Promise<IUser> {
    const user: IUser = await this.userRepository.getById(id);
    return user;
  };

  async getUserJustRegister(userName: string): Promise<IUser> {
    const fieldsToExclude = {
      password: 0,
      verificationCode: 0,
    };

    const u = await this.getByUserName(userName);
    const u2 = new User();

    u2._id = u._id;
    u2.firstName = u.firstName;
    u2.lastName = u.lastName;
    u2.email = u.email;
    u2.userName = u.userName;
    u2.roles = u.roles;
    u2.verified = u.verified;
    return u2;
  };

  async create(userRegisterDTO: IUser): Promise<IUser> {
    try {
      let newUser: IUser = new User();
      newUser.userName = userRegisterDTO.userName;
      newUser.email = userRegisterDTO.email;
      newUser.firstName = userRegisterDTO.firstName;
      newUser.lastName = userRegisterDTO.lastName;
      newUser.password = userRegisterDTO.password;
      newUser.roles = userRegisterDTO.roles;
      newUser.verified = false;
      newUser.enable = true;
      newUser.verificationCode = "";

      const userNew: IUser = await this.userRepository.create(newUser);
      return userNew;
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

  async delete(id: string): Promise<boolean> {
    const deleted: boolean = await this.userRepository.delete(id);
    return deleted;
  };

  async updateById(id: string, user: IUser): Promise<boolean> {
    const updatedUser: boolean = await this.userRepository.updateById(id, user);
    return updatedUser;
  };

  async getByUserName(userName: string): Promise<IUser> {
    const query = { userName: userName };
    const user = await this.userRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<IUser> {
    const user = await this.userRepository.getByQuery(query);
    return user;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updatedProduct: boolean = await this.userRepository.update(query, valuesToSet);
    return updatedProduct;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.userRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.userRepository.hasByQuery(query);
  };

};
