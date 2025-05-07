import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  url: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'done' | 'error';

  @Prop()
  title?: string;

  @Prop()
  html?: string;

  @Prop()
  screenshot?: string;

  @Prop({ default: 0 })
  riskScore: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
