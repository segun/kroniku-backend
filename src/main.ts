import { NestFactory } from '@nestjs/core';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionLoggingFilter } from './common/logging/http-exception.logging.filter';
import { RequestLoggingMiddleware } from './common/logging/request-logging.middleware';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const logLevels = getLogLevels(process.env.LOG_LEVEL);
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  app.enableShutdownHooks();
  const requestLoggingMiddleware = new RequestLoggingMiddleware();
  app.use(requestLoggingMiddleware.use.bind(requestLoggingMiddleware));
  app.useGlobalFilters(new HttpExceptionLoggingFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  logger.log(`Kroniku backend listening on port ${port}`);
}

function getLogLevels(configuredLevel: string | undefined): LogLevel[] {
  const levels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  if (!configuredLevel) {
    return levels;
  }

  const index = levels.indexOf(configuredLevel as LogLevel);
  return index >= 0 ? levels.slice(0, index + 1) : levels;
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error('Kroniku backend failed to start', error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
