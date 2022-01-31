import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  async getQuery(key: string): Promise<any> {
    const list = await this.modelBuilderService.getByTag(key);
    const answer = {
      key: key,
      result: list,
    };
    return answer;
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
    if (event.eventType === 'productPlaced') {
      //return await this.modelBuilderService.handleOrderPlaced(event);
      console.log(
        'Warehouse app service handle event gets \n' +
          JSON.stringify(event, null, 3),
      );
    } else {
      return {
        error: 'shop backend does not know how to handle ' + event.eventType,
      };
    }
  }
}
