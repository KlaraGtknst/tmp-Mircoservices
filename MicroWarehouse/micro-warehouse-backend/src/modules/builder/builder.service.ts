import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';

@Injectable()
export class BuilderService {
  constructor(
    @InjectModel('eventStore') private buildEventModule: Model<BuildEvent>,
  ) {
    this.clear();

    this.store({
      blockId: 'pal042',
      time: '13:48:00',
      eventType: 'PaletteStored',
      tags: ['palettes', 'red shoes'],
      payload: {
        barcode: 'pal001',
        product: 'red shoes',
        amount: 10,
        location: 'shelf 42',
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

  async clear() {
    return this.buildEventModule.db.dropCollection('eventstores');
  }

  async store(event: BuildEvent) {
    const filter = { blockId: event.blockId };
    return this.buildEventModule.findOneAndUpdate(filter, event, {
      upsert: true,
    });
  }
}
