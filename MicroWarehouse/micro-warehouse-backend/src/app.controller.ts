import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //https.//localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<string> {
    return this.appService.getQuery(key);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
