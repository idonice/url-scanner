import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<UrlDocument>,
    @InjectQueue('url-queue') private urlQueue: Queue
  ) {}

  async createAndEnqueue(url: string): Promise<Url> {
    const doc: UrlDocument = await this.urlModel.create({ url });
    const docId = (doc._id as any).toString();
    try {
      await this.urlQueue.add({ url: doc.url, docId });
      console.log("Added to queue");
    } catch (err) {
      console.error("Failed to add to queue", err);
    }
    return doc;
  }
  
  async updateStatus(id: string, status: Url['status']) {
    return this.urlModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateUrlData(id: string, data: Partial<Url>) {
    return this.urlModel.findByIdAndUpdate(id, data, { new: true });
  }

async findById(id: string) {
  return this.urlModel.findById(id).lean();
}
}
