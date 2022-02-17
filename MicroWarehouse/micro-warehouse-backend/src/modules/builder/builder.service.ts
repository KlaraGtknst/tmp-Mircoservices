/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { Palette, PaletteSchema } from './palette.schema';
import { PickTask } from './pick-task.schema';
import Subscription from './subscription';

@Injectable()
export class BuilderService implements OnModuleInit {
  subscriberUrls: string[] = [];

  constructor(
    private httpService: HttpService,
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('pickTaskStore') private pickTaskModel: Model<PickTask>,
    @InjectModel('paletteStore') private paletteModel: Model<Palette>,
  ) {}

  async onModuleInit() {
    //await this.clear();
  }

  getByTag(tag: string) {
    //console.log('getByTag called with ' + tag);
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  getOrders(tag: string) {
    //console.log('getOrders called with ' + tag);
    //location aber keine state oder customer
    //const list = this.paletteModel.find({}).exec();
    //keine location
    const list = this.pickTaskModel.find({}).exec(); // tags: tag
    //console.log('Builder Service WH BE: ' + JSON.stringify(list, null, 3));
    return list;
  }

  getDeliveries(tag: string) {
    const list = this.pickTaskModel.find({state: "picking"}).exec();
    //console.log('Builder Service WH BE: ' + JSON.stringify(list, null, 3));
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
        await this.storeModelPalette(palette);

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

    /*console.log(
      `ModelBuilderService.storePalette stores ${JSON.stringify(
        event,
        null,
        3,
      )}`,
    );*/
    return palette;
  }

  private async storeModelPalette(palette: any) {
    await this.paletteModel
      .findOneAndUpdate({ barcode: palette.barcode }, palette, { upsert: true })
      .exec();
  }

  async clear() {
    await this.paletteModel.deleteMany();
    await this.pickTaskModel.deleteMany();
    await this.buildEventModel.deleteMany();
  }

  async handleSubscription(subscription: Subscription) {
    //store in subscriber list
    if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
      this.subscriberUrls.push(subscription.subscriberUrl);
    }

    const eventList = await this.buildEventModel
      .find({
        eventType: 'productStored',
        time: { $gt: subscription.lastEventTime },
      })
      .exec();
    return eventList;
  }

  publish(newEvent: BuildEvent) {
    /*console.log(
      'BuildService subscribers URLS: \n' +
        JSON.stringify(this.subscriberUrls, null, 3),
    );*/
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

  async handleOrderPlaced(event: BuildEvent) {
    return this.store(event);
  }

  async handleProductOrdered(event: BuildEvent) {
    const storeSuccess = await this.store(event);
    if (storeSuccess) {
      const params = event.payload;
      //Added
      //this.storeModelPalette(params);
      /*palette.amount = Number(palette.amount)
      const event = {
        blockId: palette.barcode,
        time: new Date().toISOString(),
        eventType: 'paletteStored',
        tags: ['palettes', palette.product],
        payload: palette,
      };*/
      //Klara Ende
      const productPalettes = await this.paletteModel
        .find({ product: params.product })
        .exec();
      /*console.log(
        'BuilderService WH BE event.payload: ' +
          JSON.stringify(event.payload, null, 3),
      );*/
      /*console.log(
        'BuilderService WH BE productPalettes: ' +
          JSON.stringify(productPalettes, null, 3),
      );*/
      const locations: string[] = [];
      for (const pal of productPalettes) {
        /*console.log(
          'BuilderService WH BE pal: ' + JSON.stringify(pal, null, 3),
        );*/
        if (pal.location != null) {
          locations.push(pal.location);
        }
      }
      /*console.log(
        'BuilderService WH BE locations: ' + JSON.stringify(locations, null, 3),
      );*/
      const pickTask = {
        code: params.order,
        product: params.product,
        address: params.customer + ', ' + params.address,
        location: locations,
        state: 'order placed',
      };
      /*console.log(
        'BuilderService WH BE pickTask: ' + JSON.stringify(pickTask, null, 3),
      );*/
      const result = this.pickTaskModel
        .findOneAndUpdate({ code: params.code }, pickTask, {
          //{ product: params.product }, pickTask, {
          upsert: true,
          new: true,
        })
        .exec();

      //console.log('BuilderService WH BE: ' + JSON.stringify(result, null, 3));
    }
    return 200;
  }

  async handlePickDone(params: any) {
    //update palette
    //ONLY if state is "order placed", otherwise a product/order will be takn more than once from the WH palettes db
    //if (params.state === "order placed") {
      const pal = await this.paletteModel
      .findOneAndUpdate(
        { location: params.location, product: params.product },
        { $inc: { amount: -1 } },
        { new: true },
      )
      .exec();
    //}
    
    //update pick Task
    const pick = await this.pickTaskModel
      .findOneAndUpdate(
        { location: params.location, product: params.product, code: params.code },
        { state: "picking" },
        { new: true },
    )
    .exec();
    /*console.log(
      `handlePickOneDone new palette parameter\n${JSON.stringify(params, null, 3)}`,
    );
    console.log(
      `handlePickOneDone new palette\n${JSON.stringify(pal, null, 3)}`,
    );*/

    //update pickTasks
    /*const pick = await this.pickTaskModel
      .findOneAndUpdate(
        { code: params.taskCode },
        { palette: pal.barcode, state: 'shipping' },
        { new: true },
      )
      .exec();*/

    //publish change
    const event = {
      blockId: pick.code,
      time: new Date().toISOString(),
      eventType: 'orderPicked',
      tags: ['orders', pick.code, pick.product],
      payload: {
        code: pick.code,
        state: pick.state,
        address: pick.address,
        product: pick.product,
      },
    };

    const storeSuccess = await this.store(event);
    this.publish(event);
  }

  async reset() {
    await this.clear();
  }

  async getProductTypeAndLocation(id) {
    //console.log("builderservice WH BE ProduktType and Location param:" + id)
    const product = await this.pickTaskModel.findOne({code:id}).exec();
    const productType = product.product;
    const locations = product.location;
    const state = product.state;
    /*console.log("builderservice WH BE ProduktType:" + productType)
    console.log("builderservice WH BE ProduktLocation:" + locations)*/
    const event = {
      product : productType,
      location : locations,
      state : state,
    }
    return event;
  }

  async getPalettes() {
    const palettes = await this.paletteModel
    .find({ })
    .exec();

    return await palettes;
  }

  async handleDeliveryDone(params: any) {

    //update pick Task
    const pick = await this.pickTaskModel
      .findOneAndUpdate(
        { location: params.location, product: params.product, code: params.code },
        { state: "shipping" },
        { new: true },
    )
    .exec();
    /*console.log(
      `handleDeliveryDone new palette parameter\n${JSON.stringify(params, null, 3)}`,
    );
    console.log(
      `handleDeliveryeDone new pickTask\n${JSON.stringify(pick, null, 3)}`,
    );*/

    //publish change
    const event = {
      blockId: pick.code,
      time: new Date().toISOString(),
      eventType: 'orderDelivered',
      tags: ['orders', pick.code, pick.product],
      payload: {
        code: pick.code,
        state: pick.state,
        address: pick.address,
        product: pick.product,
      },
    };

    const storeSuccess = await this.store(event);
    this.publish(event);
  }
}
