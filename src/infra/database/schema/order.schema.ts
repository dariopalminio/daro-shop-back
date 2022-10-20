import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Client } from 'src/domain/model/order/client';
import { IOrderItem } from 'src/domain/model/order/order-item.interface';
import { Address } from 'src/domain/model/profile/address';

export type OrderDocument = Order & Document;

@Schema()
export class Order {

    //_id: holds an ObjectId.

    @Prop({ required: true })
    client: Client;
    
    @Prop({ required: true })
    orderItems: IOrderItem[];

    @Prop({ required: true })
    count: number;

    @Prop({ required: true })
    includesShipping: boolean; //if is false then includes pick up in store

    @Prop({ required: true })
    shippingAddress: Address;

    @Prop({ required: true })
    subTotal: number;

    @Prop({ required: true })
    shippingPrice: number;

    @Prop({ required: true })
    total: number;

    @Prop({ required: true, default: "INITIALIZED" })
    status: string;

    @Prop({ required: true, default: new Date() })
    createdAt?: Date;
  
    @Prop({ required: true, default: new Date() })
    updatedAt?: Date;
};

export const OrderSchema = SchemaFactory.createForClass(Order);
