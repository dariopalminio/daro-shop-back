import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema, Types } from 'mongoose';

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema()
export class PaymentMethod {

  //_id: holds an ObjectId.

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ type: Types.Map })
  meta: any;

  @Prop({ required: true, default: new Date() })
  createdAt?: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt?: Date;
};

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
