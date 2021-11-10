import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://KlaraGtknst:1111@klarascluster.muqhr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ),
    BuilderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
