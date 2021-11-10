import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
