/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto';
import { BuildEvent } from './modules/builder/build-event.schema';
import Subscription from './modules/builder/subscription';

@Controller()
export class AppController implements OnModuleInit {

  public port = process.env.PORT || 3100;
  public shopUrl = "http://localhost:3100/";
  public warehouseUrl = "http://localhost:3000/";

  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {
    if (this.port != 3100) {
      this.shopUrl = "https://klaragtknst-shop-backend.herokuapp.com/"
      this.warehouseUrl = "https://klaragtknst-warehouse-backend.herokuapp.com/"
    }
  }

  onModuleInit() {
    //subscribe at warehouse
    this.subscribeAtWarehouse(false);
  }

  private subscribeAtWarehouse(isReturnSubscriptionVal: boolean) {
    //subscribe at warehouse
    this.httpService
      .post(this.warehouseUrl + 'subscribe', {  //http://localhost:3000/subscribe
        subscriberUrl: this.shopUrl + 'event', //http://localhost:3100/event
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
          //console.log("SHOP subscribed at WAREHOUSE");
        } catch (error) {
          console.log(
            'Shop: AppController onModuleInit subscribe handleEvent error' +
              JSON.stringify(error, null, 3),
          );
        }
      },
    (error) => {
      console.log(
        'AppController onModuleInit error' + JSON.stringify(error, null, 3),
      );
    });
  }

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

  @Post('cmd/setPrice')
  async postCommand(@Body() params: SetPriceDto) {
    try {
      const c = await this.appService.setPrice(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/placeOrder')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    try {
      const c = await this.appService.placeOrder(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      /*console.log(
        `\n postSubscribe got subscription ${JSON.stringify(
          subscription,
          null,
          3,
        )}`,
      );*/
      const c = await this.appService.handleSubscription(subscription);
      if (!subscription.isReturnSubscription) {
        this.subscribeAtWarehouse(true);
      }
      return c;
    } catch (error) {
      return error;
    }
  }

  //http://localhost:3100/pickingDone/' + params.product
  @Get('pickingDone/:key')
  async orderPlacedToPicking(@Param('key') key: string): Promise<any> {
    const result = await this.appService.handleOrderPickedOrdersModel(key);
    //console.log(`\n pickingDone update`);
    return result;
  }
}
