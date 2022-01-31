/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    //subscribe at shop
    this.subscribeAtMicroShop(false);
  }

  private subscribeAtMicroShop(isReturnSubscriptionVal: boolean) {
    //subscribe at shop
    this.httpService
      .post('http://localhost:3100/subscribe', {
        subscriberUrl: 'http://localhost:3000/event',
        lastEventTime: '0',
        isReturnSubscription: isReturnSubscriptionVal,
      })
      .subscribe(async (response) => {
        try {
          //list of events
          const eventList: any[] = response.data;
          for (const event of eventList) {
            await this.appService.handleEvent(event);
          }
          console.log("WAREHOUSE subscribed at SHOP");
        } catch (error) {
          console.log(
            'Warehouse: AppController onModuleInit subscribe handleEvent error' +
              JSON.stringify(error, null, 3),
          );
        }
      },
    (error) => {
      console.log(
        'Warehouse: AppController onModuleInit error' + JSON.stringify(error, null, 3),
      );
    });
  }

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
      if (!subscription.isReturnSubscription) {
        this.subscribeAtMicroShop(true);
      }
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
