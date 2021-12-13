import { Injectable } from '@nestjs/common';
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

  handleCommand(command: Command) {
    if (command.opCode === 'storePalette') {
      this.modelBuilderService.storePalette(command.parameters);
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
}
