import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { User } from '../../../domain/model/user/user';
import { UserDocument } from '../schema/user.schema';
import { GenericRepository } from './generic-repository';
import { UserEntityFactory } from 'src/domain/model/user/user-entity.factory';

@Injectable()
export class UserRepository extends GenericRepository<UserDocument, User> implements IRepository<User> {

    constructor(
        @InjectModel('User')
        userModel: Model<UserDocument>,
    ) { 
        super(userModel, new UserEntityFactory());
    }

}
