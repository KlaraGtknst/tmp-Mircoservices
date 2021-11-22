/* eslint-disable prettier/prettier */
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BuildEvent {
  @Prop({ required: true}) //, trim: true }) //Eingaben von ungewollten Spaces befreien
  eventType: string;

  @Prop({ required: true })
  blockId: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  payload: any;
}

export const BuildEventSchema = SchemaFactory.createForClass(BuildEvent);