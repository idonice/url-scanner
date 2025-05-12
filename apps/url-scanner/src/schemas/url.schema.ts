import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;
class UrlMetadata {
  @Prop() domain?: string;
  @Prop() faviconHost?: string;
  @Prop() mainIp?: string;
  @Prop() ipCountry?: string;
  @Prop() tlsIssuer?: string;
  @Prop() tlsValidFrom?: string;
  @Prop() tlsValidTo?: string;
  @Prop() externalDomainsCount?: number;
  @Prop() httpRequestCount?: number;
}
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

  @Prop({ default: [] })
  risksDescription: string[];

  @Prop({ type: UrlMetadata, default: {} })
  metadata: UrlMetadata;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
