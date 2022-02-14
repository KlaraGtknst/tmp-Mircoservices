/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  public port = process.env.PORT || 3000;
  public shopUrl = "http://localhost:3100/";
  public warehouseUrl = "http://localhost:3000/";

  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {
    if (this.port != 3000) {
      this.shopUrl = "https://klaragtknst-shop-backend.herokuapp.com/"
      this.warehouseUrl = "https://klaragtknst-warehouse-backend.herokuapp.com/"
    }
  }

  onModuleInit() {
    //subscribe at shop
    this.subscribeAtMicroShop(false);
  }

  private subscribeAtMicroShop(isReturnSubscriptionVal: boolean) {
    //subscribe at shop
    this.httpService
      .post(this.shopUrl + 'subscribe', {  //http://localhost:3100/subscribe
        subscriberUrl: this.warehouseUrl + 'event', //http://localhost:3000/event
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
          //console.log("WAREHOUSE subscribed at SHOP");
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
  //https://localhost:3000/query/orders-name
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {

    //console.log(`appController.getQuery WH BE called with key ${key}`);

    const result: Promise<any> = await this.appService.getQuery(key);
    
    /*console.log(
      `appController.getQuery done ${JSON.stringify(result, null, 3)}\n`,
    );*/
    return result;
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      //console.log(`got command ${JSON.stringify(command, null, 3)}`);
      const c = await this.appService.handleCommand(command);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      return await this.appService.handleEvent(event);;
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/pickDone')
  async postPickDOne(@Body() params: any) {
    try {
      //update ordersModel for Shop FE (http://localhost:4400/home/customerName)
      /*his.httpService.get<any>('http://localhost:3100/pickingDone/' + params.product)
        .subscribe(
          error => console.log("WH BE update SHop FE home order placed to picking failed: " + JSON.stringify(error, null, 3))
        );*/


      //console.log(`\n pickingDone update WH BE: ` + JSON.stringify(params.product, null, 3));
      //this.logger.log(`\npostPickDone got ${JSON.stringify(params, null, 2)}`)
      const c = await this.appService.handlePickDone(params);

      
      //console.log(`\n pickingDone update WH BE`);
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

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Post('cmd/deliverDone')
  async postDeliveryDone(@Body() params: any) {
    try {
      //update ordersModel for Shop FE (http://localhost:4400/home/customerName)
      /*his.httpService.get<any>('http://localhost:3100/pickingDone/' + params.product)
        .subscribe(
          error => console.log("WH BE update SHop FE home order placed to picking failed: " + JSON.stringify(error, null, 3))
        );*/


      //console.log(`\n DeliveryDone update WH BE: ` + JSON.stringify(params.product, null, 3));
      //this.logger.log(`\npostDeliveryDone got ${JSON.stringify(params, null, 2)}`)
      const c = await this.appService.handleDeliveryDone(params);

      
      //console.log(`\n pickingDone update WH BE`);
      return c;
    } catch (error) {
      return error;
    }
  }
}
