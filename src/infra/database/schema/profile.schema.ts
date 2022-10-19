import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {

  //_id: holds an ObjectId.

  @Prop({ required: true, unique: true })
  userId: string; //Auth

  @Prop()
  enable: boolean;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({
    required: true,
    min: 6,
    max: 255
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    unique: true,
    required: true,
    min: 6,
    max: 1024
  })
  email: string;
  
  @Prop()
  docType: string;

  @Prop()
  document: string;

  @Prop()
  telephone: string;

  @Prop()
  language: string;

  @Prop()
  addresses: [{
    street: { type: String }, //street with number
    department: { type: String }, //department, flat or office
    neighborhood: { type: String }, //neighborhood or commune
    city: { type: String }, //city
    state: { type: String }, //state, region or province
    country: { type: String } //country
  }]

  @Prop({ required: true, default: new Date() })
  createdAt?: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt?: Date;
};

export const ProfileSchema = SchemaFactory.createForClass(Profile);