import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Client } from 'src/order/domain/model/client';
import { IClient } from 'src/order/domain/model/client.interface';
import { OrderItem } from 'src/order/domain/model/order-item';
import { IOrderItem } from 'src/order/domain/model/order-item.interface';
import { IOrder } from 'src/order/domain/model/order.interface';
import { AddressDocument } from '../../common/infrastructure/database/schema/address.schema';

export type OrderDocument = Order & Document;

@Schema()
export class ClientDocument extends Document implements IClient{

    @Prop({ required: true, unique: true }) // implicitly has "index: true" because is unique
    userId: string; //Auth

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
    }) // implicitly has "index: true" because is unique
    email: string;

    @Prop()
    docType: string;

    @Prop()
    document: string;

    @Prop()
    telephone: string;

};


@Schema()
export class OrderItemDocument extends Document implements IOrderItem{

    @Prop({ required: true })
    productId: string;

    @Prop()
    imageUrl: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    grossPrice: number;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    amount: number;
};


@Schema()
export class Order implements IOrder{

  //_id: holds an ObjectId autogenerated. Iimplicitly has "index: true",  24 characters.

    @Prop({ required: true })
    client: ClientDocument;

    @Prop({ required: true })
    orderItems: OrderItemDocument[];

    @Prop({ required: true })
    count: number;

    @Prop({ required: true })
    includesShipping: boolean; //if is false then includes pick up in store

    @Prop({ required: true })
    shippingAddress: AddressDocument;

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
