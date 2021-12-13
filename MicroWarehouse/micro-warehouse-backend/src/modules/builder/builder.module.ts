import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
