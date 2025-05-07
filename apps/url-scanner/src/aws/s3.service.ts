import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME!; 
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadBuffer(buffer: Buffer, key: string): Promise<string> {
    try {
        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: 'image/png',
          }),
        );
        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      } catch (error) {
        console.error('upload failed:', error);
        throw error;
      }
  }
}
