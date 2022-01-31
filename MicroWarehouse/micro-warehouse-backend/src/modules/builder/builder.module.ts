import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { PaletteSchema } from './palette.schema';
import { PickTaskSchema } from './pick-task.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
      { name: 'pickTaskStore', schema: PickTaskSchema },
      { name: 'paletteStore', schema: PaletteSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
