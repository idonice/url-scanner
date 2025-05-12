import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import puppeteer from 'puppeteer';
import { AppService } from './app.service';
import { S3Service } from './aws/s3.service';
import { getWhoisInfo } from './url-scanner.util';

@Processor('url-queue')
export class AppProcessor {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
  ) {}

  @Process({ concurrency: 5 })
  async handle(job: Job<{ url: string; docId: string }>) {
    let risksDescription: string[] = [];

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
    const s3Url = await this.s3Service.uploadBuffer(screenshot as Buffer, key);
    console.log('Screenshot uploaded to:', s3Url);

    let riskScore = 0;
    if (!url.startsWith('https://')) {
      riskScore += 20;
      risksDescription.push('Connection is not secure (no HTTPS)');
    }

    const hasIframe = await page.evaluate(
      () => !!document.querySelector('iframe'),
    );
    if (hasIframe) {
      riskScore += 20;
      risksDescription.push(
        'Page contains iframe(s) — may hide external content',
      );
    }

    const faviconUrl = await page.evaluate(() => {
      const link = document.querySelector("link[rel~='icon']");
      return (link as HTMLLinkElement)?.href || null;
    });

    if (faviconUrl) {
      const faviconHost = new URL(faviconUrl).hostname;
      const pageHost = new URL(url).hostname;

      if (faviconHost !== pageHost) {
        riskScore += 10;
        risksDescription.push(
          `Favicon loaded from different domain (${faviconHost})`,
        );
      }
      if (faviconHost.includes('google') && !pageHost.includes('google')) {
        riskScore += 15;
        risksDescription.push('Favicon appears to be stolen from Google');
      }
    } else {
      riskScore += 5;
      risksDescription.push('No favicon found');
    }

    const suspiciousWords = ['secure', 'login', 'update', 'verify'];
    if (suspiciousWords.some((w) => url.includes(w))) {
      riskScore += 5;
    }

    const whoisRiskScore = await getWhoisInfo(url);
    if (whoisRiskScore) {
      riskScore += whoisRiskScore;
    }

    await this.appService.updateUrlData(docId, {
      status: 'done',
      title,
      screenshot: s3Url,
      riskScore,
      risksDescription,
    });

    await browser.close();
  }
}
