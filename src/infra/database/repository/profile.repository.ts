import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/domain/model/profile/profile';
import { ProfileEntityFactory } from 'src/domain/model/profile/profile.factory';
import { IRepository } from '../../../domain/outgoing/repository.interface';
import { ProfileDocument } from '../schema/profile.schema';
import { GenericRepository } from './generic-repository';

/**
 * Profile Mongo repository implementation
 */
 @Injectable()
 export class ProfileRepository extends GenericRepository<ProfileDocument, Profile> implements IRepository<Profile> {
 
     constructor(
         @InjectModel('Profile')
         profileModel: Model<ProfileDocument>,
     ) { 
         super(profileModel, new ProfileEntityFactory());
     }
 
 };
