import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
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
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorHttpStatusCode: 422,

      // Format validation errors as { field1: [error1, error2], field2: [error1, error2] }
      errorFormatter: (errors) => {
        return errors.reduce(
          (acc, error) => {
            acc[error.property] = Object.values(error.constraints || {});
            return acc;
          },
          {} as Record<string, string[]>,
        );
      },

      // Format the final response as { errors: { field1: [error1, error2], field2: [error1, error2] } }
      responseBodyFormatter: (_, __, formattedErrors) => ({
        errors: formattedErrors,
      }),
    }),
  );

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);

  return app;
}

bootstrap();
