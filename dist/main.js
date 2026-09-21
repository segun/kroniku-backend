"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_logging_filter_1 = require("./common/logging/http-exception.logging.filter");
const request_logging_middleware_1 = require("./common/logging/request-logging.middleware");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const logLevels = getLogLevels(process.env.LOG_LEVEL);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logLevels,
    });
    app.enableShutdownHooks();
    const requestLoggingMiddleware = new request_logging_middleware_1.RequestLoggingMiddleware();
    app.use(requestLoggingMiddleware.use.bind(requestLoggingMiddleware));
    app.useGlobalFilters(new http_exception_logging_filter_1.HttpExceptionLoggingFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    logger.log(`Kroniku backend listening on port ${port}`);
}
function getLogLevels(configuredLevel) {
    const levels = ['log', 'error', 'warn', 'debug', 'verbose'];
    if (!configuredLevel) {
        return levels;
    }
    const index = levels.indexOf(configuredLevel);
    return index >= 0 ? levels.slice(0, index + 1) : levels;
}
bootstrap().catch((error) => {
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Kroniku backend failed to start', error instanceof Error ? error.stack : String(error));
    process.exit(1);
});
//# sourceMappingURL=main.js.map