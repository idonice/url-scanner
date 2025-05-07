import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { Url, UrlSchema } from './schemas/url.schema'; 
import { AppProcessor } from './app.processor'; 
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './aws/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb+srv://idonice3:Dx1iYKBjGVoANdu1@cluster0.yawu8ok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    BullModule.registerQueue({
      name: 'url-queue',
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    AppProcessor,
    S3Service,
  ],
})
export class AppModule {}
