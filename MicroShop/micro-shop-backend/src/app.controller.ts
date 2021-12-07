import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Get('event')
  async getEvent(@Param('product') product: string): Promise<any> {
    return await this.appService.getEvent(product);
  }

  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    const result = await this.appService.getQuery(key);
    return result;
  }

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }
}
