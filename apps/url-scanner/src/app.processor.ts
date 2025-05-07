import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import puppeteer from 'puppeteer';
import { AppService } from './app.service';
import { S3Service } from './aws/s3.service';
@Processor('url-queue')
export class AppProcessor {
    constructor(private readonly appService: AppService,private readonly s3Service: S3Service,) {}

  @Process({ concurrency: 5 })
  async handle(job: Job<{ url: string; docId: string }>) {
    //accepting and saving
    const { url, docId } = job.data;
    console.log('job received:', job.data);
    await this.appService.updateStatus(docId, 'in-progress');
    //scanning
    const browser = await puppeteer.launch(); // open "browser"
    const page = await browser.newPage(); // open "tab"
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    //after scanning
    const title = await page.title();
    const screenshot = await page.screenshot({ fullPage: true });
    
    const key = `screenshot/${docId}.png`;
    const s3Url = await this.s3Service.uploadBuffer(screenshot as Buffer,key); 
    console.log('Screenshot uploaded to:', s3Url); 

    
    await this.appService.updateUrlData(docId, {
      status: 'done',
      title,
      screenshot: s3Url, 
    }); 
  
    await browser.close();

  }
}