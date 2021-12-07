/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  getHello(): string {
    return 'Hello World from MicroShop Backend!';
  }

  async getQuery(key: string): Promise<any> {
    if (key === "customers") {
      return await this.modelBuilderService.getCustomers();
    }
    else {
      return {error: 'Microshop backend does not know how to handle query key' + key}
    }
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'The shop database is clear.';
  }

  async getEvent(event: string) {
    const list = await this.modelBuilderService.getByTag(event);
    const answer = {
      event: event,
      result: list,
    };
    return answer;
  }

  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productStored') {
      return await this.modelBuilderService.handleProductStored(event);
    } else if (event.eventType === 'addOffer') {
      return await this.modelBuilderService.handleAddOffer(event);
    } else if (event.eventType === 'placeOrder') {
      return await this.modelBuilderService.handlePlaceOrder(event);
    }
    return event;
  }
}
