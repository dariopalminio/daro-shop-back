import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  //_id: holds an ObjectId.

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

  @Prop({
    required: true
  })
  password: string;

  @Prop()
  roles: string[];

  @Prop({
    default: false,
  })
  verified: boolean;

  @Prop()
  verificationCode: string;

  @Prop({
    default: Date.now(),
  })
  startVerificationCode: Date;

};

export const UserSchema = SchemaFactory.createForClass(User);
