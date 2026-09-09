import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenApiModule } from './openapi.module';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(OpenApiModule, { logger: false });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kroniku Backend API')
    .setDescription('Machine-readable OpenAPI spec generated from Nest controllers')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const outputDir = resolve(__dirname, '../../..', 'docs');
  const outputFile = resolve(outputDir, 'openapi.json');
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, JSON.stringify(document, null, 2), 'utf8');

  await app.close();
  // eslint-disable-next-line no-console
  console.log(`OpenAPI spec written to ${outputFile}`);
}

generateOpenApiSpec().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate OpenAPI spec', error);
  process.exit(1);
});
