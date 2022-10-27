import { Injectable, Inject } from '@nestjs/common';
import { IUserService } from 'src/domain/incoming/user.service.interface';
import { User } from 'src/domain/model/user/user';
import { IRepository } from 'src/domain/outgoing/repository.interface';
import { DomainError } from 'src/domain/error/domain-error';
import { generateToken } from 'src/domain/helper/token.helper';
import { RolesEnum } from 'src/domain/model/auth/reles.enum';
import { ResponseCode } from 'src/domain/model/service/response.code.enum';

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
    const usr: User = await this.getByUserName(userName);
    return usr;
  };

  async create(userRegister: User): Promise<User> {
    try {
      userRegister.setVerified(false);
      userRegister.setEnable(true);
      userRegister.setVerificationCode(generateToken());

      if (this._areRolesInvalid(userRegister.getRoles())) {
        throw new Error('There is some invalid role!');
      };

    } catch (error) {
      throw new DomainError(ResponseCode.BAD_REQUEST, error.message, error);
    }
    try {
      const userNew: User = await this.userRepository.create(userRegister);
      return userNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      switch (error.code) {
        case 11000:
          //  duplicate key error collection
          throw new DomainError(ResponseCode.CONFLICT, error.message, error);
        default:
          //Internal server error
          throw new DomainError(ResponseCode.INTERNAL_SERVER_ERROR, error.message, error);
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

  private _areRolesInvalid(roles: string[]): boolean {
    let valid: boolean = false;
    let i = 0;
    do {
      if (!Object.keys(RolesEnum).includes(roles[i].toUpperCase())) {
        valid = true;
      }
      i += 1;
    } while ((i < roles.length) && (valid === false));
    return valid;
  };

};
