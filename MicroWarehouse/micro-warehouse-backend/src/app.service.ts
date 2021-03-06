/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  async getQuery(key: string): Promise<any> {
    if (key === 'orders') {
      const list = await this.modelBuilderService.getOrders(key);
      return list; 
    } else if (key === 'deliveries') {
      const list = await this.modelBuilderService.getDeliveries(key);
      return list;
    } else if (key.startsWith("orders_")) {
      const id = key.substring('orders_'.length);
      return await this.modelBuilderService.getProductTypeAndLocation(id);
    } else if (key === 'palettes') { 
      return await this.modelBuilderService.getPalettes()
    } else {
      const list = await this.modelBuilderService.getByTag(key);
      const answer = {
        key: key,
        result: list,
      };
      return answer;
    }
  }

  async handleCommand(command: Command) {
    if (command.opCode === 'storePalette') {
      await this.modelBuilderService.storePalette(command.parameters);
      return command;
    } else {
      return `cannot handle ${command.opCode}`;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async handleSubscription(subsribtion: Subscription) {
    return await this.modelBuilderService.handleSubscription(subsribtion);
  }

  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productOrdered') {
      /*console.log(
        'Warehouse app service handle event gets \n' +
          JSON.stringify(event, null, 3),
      );*/
      return await this.modelBuilderService.handleProductOrdered(event);
    } else {
      return {
        error: 'shop backend does not know how to handle ' + event.eventType,
      };
    }
  }

  async handlePickDone(params: any) {
    return await this.modelBuilderService.handlePickDone(params);
  }

  async handleDeliveryDone(params: any) {
    return await this.modelBuilderService.handleDeliveryDone(params);
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'The Warehouse database is clear.';
  }
}
