import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //https.//localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    return this.appService.getQuery(key);
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      console.log(`got command ${JSON.stringify(command, null, 3)}`);
      const c = await this.appService.handleCommand(command);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
