import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/model/user/user';
import { UserDocument } from './user.schema';
import { MongoGenericRepository } from "hexa-three-levels";
import { UserEntityFactory } from 'src/auth/domain/model/user/user-entity.factory';
import { IRepository } from "hexa-three-levels";

@Injectable()
export class UserRepository extends MongoGenericRepository<UserDocument, User> implements IRepository<User> {

    constructor(
        @InjectModel('User')
        userModel: Model<UserDocument>,
    ) { 
        super(userModel, new UserEntityFactory());
    }

}
