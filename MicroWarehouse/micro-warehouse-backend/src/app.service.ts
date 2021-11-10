import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getQuery(key: string): any {
    const answer = {
      key: key,
      result: [
        {
          blockId: 'pal001',
          time: '12:00:00',
          eventType: 'PaletteStored',
          tags: ['palettes', 'red shoes'],
          payload: {
            barcode: 'pal001',
            product: 'red shoes',
            amount: 10,
            location: 'shelf 42',
          },
        },
        {
          blockId: 'pal002',
          time: '12:01:00',
          eventType: 'PaletteStored',
          tags: ['palettes', 'red shoes'],
          payload: {
            barcode: 'pal002',
            product: 'red shoes',
            amount: 10,
            location: 'shelf 43',
          },
        },
      ],
    };
    return answer;
    //return `the query is ${key}`;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
