import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Set up Swagger documentation in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('RealWorld API')
      .setDescription('NestJS RealWorld API implementation')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description:
            'JWT token should be provided in the format: "Token <token>"',
        },
        'Authorization',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

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
  const configService = app.get(ConfigService);
  const originStr = configService.get<string>('CORS_ORIGIN');
  const origins = originStr?.split(',') || '*';
  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Lang',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);

  return app;
}

bootstrap();
