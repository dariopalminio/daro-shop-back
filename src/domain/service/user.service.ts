import { Injectable, Inject } from '@nestjs/common';
import { IUserService } from '../service/interface/user.service.interface';
import { User } from 'src/domain/model/user/user';
import { IRepository } from '../output-port/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';

/**
 * User Service
 * 
 * The Domain Service represents the main behavior associated with a main domain object (Entity root) 
 * and its collections, as in this case the 'User' and User collection.
 * 
 * Note: Service is where your business logic lives. This layer allows you to effectively decouple the processing logic from where the routes are defined.
 * The service provides access to the domain or business logic and uses the domain model to implement use cases. 
 * The service only accesses the database or external services through the infrastructure using interfaces (output ports).
 * A service is an orchestrator of domain objects to accomplish a goal.
 */
@Injectable()
export class UserService implements IUserService<User> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IRepository<User>) {
  }

  async getAll(page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<User[]> {
    const list: User[] = await this.userRepository.getAll(page, limit, orderByField, isAscending);
    return list;
  };

  async find(query: any, page?: number, limit?: number, orderByField?: string, isAscending?: boolean): Promise<User[]> {
    const list: User[] = await this.userRepository.find(query, page, limit, orderByField, isAscending);
    return list;
  };

  async getById(id: string): Promise<User> {
    const entity: User = await this.userRepository.getById(id);
    return entity;
  };

  async getUserJustRegister(userName: string): Promise<User> {
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

  async create(userRegisterDTO: User): Promise<User> {
    try {
      let newUser: User = new User();
      newUser.userName = userRegisterDTO.userName;
      newUser.email = userRegisterDTO.email;
      newUser.firstName = userRegisterDTO.firstName;
      newUser.lastName = userRegisterDTO.lastName;
      newUser.password = userRegisterDTO.password;
      newUser.roles = userRegisterDTO.roles;
      newUser.verified = false;
      newUser.enable = true;
      newUser.verificationCode = "";

      const userNew: User = await this.userRepository.create(newUser);
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

  async updateById(id: string, user: User): Promise<boolean> {
    const updated: boolean = await this.userRepository.updateById(id, { ...user, updatedAt: new Date() });
    return updated;
  };

  async getByUserName(userName: string): Promise<User> {
    const query = { userName: userName };
    const user = await this.userRepository.getByQuery(query);
    return user;
  };

  async getByQuery(query: any): Promise<User> {
    const entity = await this.userRepository.getByQuery(query);
    return entity;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updated: boolean = await this.userRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    return updated;
  };

  async hasById(id: string): Promise<boolean> {
    return await this.userRepository.hasById(id);
  };

  async hasByQuery(query: any): Promise<boolean> {
    return await this.userRepository.hasByQuery(query);
  };

  /**
   * Factory method
   * @param dto dto any object
   * @returns  user object instance
   */
   makeEntityFromAny(dto: any): User {
    let user: User = new User();
    user.setFromAny(dto);
    return user;
  };

};
