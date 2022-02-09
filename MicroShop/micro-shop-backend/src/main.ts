import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //app is webserver
  const app = await NestFactory.create(AppModule);
  //FE may talk to BE
  app.enableCors();
  //switches on validation of paramter input
  app.useGlobalPipes(new ValidationPipe());
  //listen tells webserver to start working
  const port = process.env.PORT || 3100;
  await app.listen(port);
  console.log('shop backend is running on port 3100');
}
//bootstrap starts application
bootstrap();
