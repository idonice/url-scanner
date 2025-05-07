import { Controller, Post, Body, Get , Param} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('url-scanner')
export class AppController {
  constructor(private readonly AppService: AppService) {}

  @Post()
  async submitUrl(@Body('url') url: string) {
    return this.AppService.createAndEnqueue(url);
  }

  @Get(':id')
  async getUrl(@Param('id') id: string) {
    return this.AppService.findById(id);
  }
}

