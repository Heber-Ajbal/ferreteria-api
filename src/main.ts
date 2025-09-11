// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true, 
    transformOptions: { enableImplicitConversion: true },
  }),
);

  const config = new DocumentBuilder()
    .setTitle('Ferretería API')
    .setDescription('API para catálogo, inventario, compras y ventas')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  // Fuerza host/puerto explícitos
  const port = Number(process.env.PORT ?? 3000);
  const host = '0.0.0.0'; // también vale '127.0.0.1'

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`✅ API viva:  http://localhost:${port}  |  📚 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
