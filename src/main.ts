import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('RealWorld API')
      .setDescription('NestJS RealWorld API implementation')
      .setVersion('1.0')
      .addBearerAuth() // Enable Bearer authentication
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true, // Automatically remove properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
