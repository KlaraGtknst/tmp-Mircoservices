import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import Subscription from './subscription';

@Injectable()
export class BuilderService implements OnModuleInit {
  subscriberUrls: string[] = [];

  constructor(
    private httpService: HttpService,
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
  ) {}

  async onModuleInit() {
    await this.clear();
  }

  getByTag(tag: string) {
    console.log('getByTag called with ' + tag);
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  async store(event: BuildEvent) {
    //ensure at least a placeholder
    const placeholder = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId },
        { blockId: event.blockId, $setOnInsert: { time: '' } },
        { upsert: true, new: true },
      )
      .exec();
    const newEvent = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId, name: { $lt: event.time } },
        event,
        { new: true },
      )
      .exec();
    return newEvent != null;
  }

  async storePalette(palette: any) {
    palette.amount = Number(palette.amount);
    const event = {
      blockId: palette.barcode,
      time: new Date().toISOString(),
      eventType: 'paletteStored',
      tags: ['palettes', palette.product],
      payload: palette,
    };

    try {
      const storeSuccess = await this.store(event);

      const amount = await this.computeAmount(palette.product);

      if (storeSuccess) {
        const newEvent = {
          eventType: 'productStored',
          blockId: palette.product,
          time: event.time,
          tags: [],
          payload: {
            product: palette.product,
            amount: amount,
          },
        };
        await this.store(newEvent);
        // publish product stored event to shop
        this.publish(newEvent);
      }
      //this.store(event);
    } catch (error) {
      console.log(`store did not work ${error}`);
    }

    console.log(
      `ModelBuilderService.storePalette stores ${JSON.stringify(
        event,
        null,
        3,
      )}`,
    );
    return palette;
  }

  clear() {
    return this.buildEventModel.remove();
  }

  async handleSubscription(subscription: Subscription) {
    //store in subscriber list
    if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
      this.subscriberUrls.push(subscription.subscriberUrl);
    }

    const eventList = await this.buildEventModel
      .find({
        eventType: 'productStored', //'PaletteStored',
        time: { $gt: subscription.lastEventTime },
      })
      .exec();
    return eventList;
  }

  publish(newEvent: BuildEvent) {
    console.log(
      'BuildService subscribers URLS: \n' +
        JSON.stringify(this.subscriberUrls, null, 3),
    );
    const oldUrls = this.subscriberUrls;
    this.subscriberUrls = [];
    for (const subscriberUrl of oldUrls) {
      this.httpService.post(subscriberUrl, newEvent).subscribe(
        (response) => {
          /*console.log(
            'Warehouse builder service publish post response is \n' +
              JSON.stringify(response, null, 3),
          );*/
          this.subscriberUrls.push(subscriberUrl);
        },
        (error) => {
          console.log(
            'build service publish error \n' + JSON.stringify(error, null, 3),
          );
        },
      );
    }
  }

  async computeAmount(productName: any) {
    //all paletteStored for product
    const paletteStoredList: any[] = await this.buildEventModel
      .find({
        eventType: 'paletteStored',
        'payload.product': productName,
      })
      .exec();

    let sum = 0;
    for (const e of paletteStoredList) {
      sum = sum + e.payload.amount;
    }

    //minus picked orders later

    return sum;
  }
}
