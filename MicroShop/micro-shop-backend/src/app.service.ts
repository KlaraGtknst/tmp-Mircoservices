/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';
import Subscription from './modules/builder/subscription';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  getHello(): string {
    return 'Hello World from MicroShop Backend!';
  }

  async getQuery(key: string): Promise<any> {
    if (key === "customers") {
      return await this.modelBuilderService.getCustomers();
    } else if (key === "products") {
      return await this.modelBuilderService.getProducts();
    } else if (key.startsWith("product-")) {
      const name = key.substring('product-'.length);
      return await this.modelBuilderService.getProduct(name);
    } else if (key.startsWith('orders_')) {
      const customer = key.substring('orders_'.length);
      return await this.modelBuilderService.getOrdersOf(customer);
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
    } else if (event.eventType === 'orderPicked') {
      return await this.modelBuilderService.handleOrderPicked(event);
    } else if (event.eventType === 'orderDelivered') {
      return await this.modelBuilderService.handleOrderDelivered(event);
    }
    return {error: 'shop backend does not know how to handle ' + event.eventType};
  }

  async setPrice(params: SetPriceDto) {
    return await this.modelBuilderService.setPrice(params);
  }

  async placeOrder(params: PlaceOrderDto) {
    await this.modelBuilderService.placeOrder(params);
    return 200;
  }

  async handleSubscription(subsription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subsription);
  }

  async handleOrderPickedOrdersModel(product: string) {
    return await this.modelBuilderService.handleOrderPickedOrdersModel(product);
  }
}
