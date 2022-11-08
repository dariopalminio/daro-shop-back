import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/domain/model/profile/profile';
import { ProfileEntityFactory } from 'src/domain/model/profile/profile.factory';
import { ProfileDocument } from '../schema/profile.schema';
import { MongoGenericRepository } from "hexa-three-levels";
import { IRepository } from "hexa-three-levels";

/**
 * Profile Mongo repository implementation
 */
 @Injectable()
 export class ProfileRepository extends MongoGenericRepository<ProfileDocument, Profile> implements IRepository<Profile> {
 
     constructor(
         @InjectModel('Profile')
         profileModel: Model<ProfileDocument>,
     ) { 
         super(profileModel, new ProfileEntityFactory());
     }
 
 };
