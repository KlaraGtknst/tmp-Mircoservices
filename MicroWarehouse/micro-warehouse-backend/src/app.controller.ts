import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  //https.//localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    //return this.appService.getQuery(key);

    console.log(`appController.getQuery called with key ${key}`);
    const result: Promise<any> = await this.appService.getQuery(key);
    console.log(
      `appController.getQuery done ${JSON.stringify(result, null, 3)}\n`,
    );
    return result;
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

  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      const c = await this.appService.handleSubscription(subscription);
      return c;
    } catch (error) {
      console.log(
        'Warehouse postSubscripton error \n' + JSON.stringify(error, null, 3),
      );
      //return error;
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
