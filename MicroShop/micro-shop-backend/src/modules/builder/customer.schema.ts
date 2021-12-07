/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastAddress: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
