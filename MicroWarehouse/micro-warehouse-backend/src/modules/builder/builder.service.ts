import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
  ) {}

  async onModuleInit() {
    await this.clear();

    this.store({
      blockId: 'pal001',
      time: '13:48:00',
      eventType: 'PaletteStored',
      tags: ['palettes', 'black tshirt'],
      payload: {
        barcode: 'pal001',
        product: 'black tshirt',
        amount: 13,
        location: 'shelf 1',
      },
    });

    this.store({
      blockId: 'pal011',
      time: '13:49:00',
      eventType: 'PaletteStored',
      tags: ['palettes', 'red shoes'],
      payload: {
        barcode: 'pal011',
        product: 'red shoes',
        amount: 10,
        location: 'shelf 11',
      },
    });
  }

  getByTag(tag: string) {
    console.log('getByTag called with ' + tag);
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  store(event: BuildEvent) {
    const filter = { blockId: event.blockId };
    return this.buildEventModel
      .findOneAndUpdate(filter, event, { upsert: true })
      .exec();
  }

  storePalette(palette: any) {
    //should check the palette for consistency
    const event = {
      blockId: palette.barcode,
      time: new Date().toISOString(),
      eventType: 'PaletteStored',
      tags: ['palettes', palette.product],
      payload: palette,
    };

    try {
      this.store(event);
    } catch (error) {
      console.log(`Store did not work ${error}`);
    }
    return palette;
  }

  clear() {
    return this.buildEventModel.remove(); //deleteOne(); //db.dropCollection('eventstores');
  }
}
