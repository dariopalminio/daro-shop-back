import { Injectable, Inject } from '@nestjs/common';
import { IUserService } from 'src/auth/domain/user.service.interface';
import { User } from 'src/auth/domain/model/user/user';
import { generateToken } from 'src/auth/domain/helper/token.helper';
import { RolesEnum } from 'src/auth/domain/model/reles.enum';
import { UserNotFoundError, UserDuplicateError, UserFormatError } from './user-errors';
import { IRepository, PaginatedResult, DomainError, ErrorCode } from "hexa-three-levels";

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
  
  findExcludingFields(query: any, fieldsToExclude: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  searchExcludingFields(queryFilter: any, fieldsToExclude: any, page: number, limit: number, orderByField: string, isAscending: boolean): Promise<PaginatedResult<any>> {
    throw new Error('Method not implemented.');
  }

  search(queryFilter?: any, page?: number | undefined, limit?: number | undefined, orderByField?: string | undefined, isAscending?: boolean | undefined): Promise<PaginatedResult<User>> {
    throw new Error('Method not implemented.');
  };
  
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
    if (!entity || entity === null) throw new UserNotFoundError();
    return entity;
  };

  async getUserJustRegister(username: string): Promise<User> {
    const fieldsToExclude = {
      password: 0,
      verificationCode: 0,
    };
    const usr: User = await this.getByUsername(username);
    return usr;
  };

  async create<IUser>(userDTO: IUser): Promise<User> {
    let userEntity: User;
    try {
      userEntity = new User(userDTO);
    } catch (error) {
      throw new UserFormatError('User data malformed:' + error.message);
    }
    try {
      userEntity.setVerified(false);
      userEntity.setEnable(true);
      userEntity.setVerificationCode(generateToken());

      if (this._areRolesInvalid(userEntity.getRoles())) {
        throw new Error('There is some invalid role!');
      };

    } catch (error) {
      throw new DomainError(ErrorCode.BAD_REQUEST, error.message, error);
    }
    try {
      const userNew: User = await this.userRepository.create(userEntity);
      return userNew;
    } catch (error) { //MongoError 
      console.log("create error code:", error.code);
      if (error.code && error.code === 11000) {
        throw new UserDuplicateError(`Database error: Duplicate key error collection or index problem. ${error.message}`);
      }
      throw new DomainError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, '', error); //Internal server error
    }
  };

  async delete(id: string): Promise<boolean> {
    const found: boolean = await this.userRepository.hasById(id);
    if (!found) throw new UserNotFoundError();
    const deleted: boolean = await this.userRepository.delete(id);
    return deleted;
  };

  async updateById<IUser>(id: string, userDTO: IUser): Promise<boolean> {
    let userToUpdate: User;
    try {
      userToUpdate = new User(userDTO);
    } catch (error) {
      throw new UserFormatError('User data malformed:' + error.message);
    }
    const found: boolean = await this.userRepository.hasById(id);
    if (!found) throw new UserNotFoundError();
    const updated: boolean = await this.userRepository.updateById(id, userToUpdate);
    return updated;
  };

  async getByUsername(username: string): Promise<User> {
    const query = { username: username };
    const entity = await this.userRepository.getByQuery(query);
    if (!entity || entity === null) throw new UserNotFoundError();
    return entity;
  };

  async getByQuery(query: any): Promise<User> {
    const entity: User = await this.userRepository.getByQuery(query);
    if (!entity || entity === null) throw new UserNotFoundError();
    return entity;
  };

  async update(query: any, valuesToSet: any): Promise<boolean> {
    const updated: boolean = await this.userRepository.update(query, { ...valuesToSet, updatedAt: new Date() });
    if (!updated) throw new UserNotFoundError();
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
