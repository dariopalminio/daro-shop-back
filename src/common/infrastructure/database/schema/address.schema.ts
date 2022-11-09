import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class AddressDocument extends Document {

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string; //street with number

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  neighborhood: string; //neighborhood or commune

  @Prop({ required: true })
  department: string; //department, flat or office

  @Prop({ required: true })
  street: string;

};
