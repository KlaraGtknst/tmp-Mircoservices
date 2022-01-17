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
import { SetPriceDto } from './common/SetPriceDto';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    //subscribe at warehouse
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3100/event',
        lastEventTime: '0',
      })
      .subscribe(async (response) => {
        try {
          //list of events
          const eventList: any[] = response.data;
          for (const event of eventList) {
            await this.appService.handleEvent(event);
          }
        } catch (error) {
          console.log(
            'AppController onModuleInit subscribe handleEvent error' +
              JSON.stringify(error, null, 3),
          );
        }
      });
    (error) => {
      console.log(
        'AppController onModuleInit error' + JSON.stringify(error, null, 3),
      );
    };
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
}
