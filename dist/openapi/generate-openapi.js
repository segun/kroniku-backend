"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const openapi_module_1 = require("./openapi.module");
async function generateOpenApiSpec() {
    const app = await core_1.NestFactory.create(openapi_module_1.OpenApiModule, { logger: false });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Kroniku Backend API')
        .setDescription('Machine-readable OpenAPI spec generated from Nest controllers')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    const outputDir = (0, node_path_1.resolve)(__dirname, '../../..', 'docs');
    const outputFile = (0, node_path_1.resolve)(outputDir, 'openapi.json');
    (0, node_fs_1.mkdirSync)(outputDir, { recursive: true });
    (0, node_fs_1.writeFileSync)(outputFile, JSON.stringify(document, null, 2), 'utf8');
    await app.close();
    console.log(`OpenAPI spec written to ${outputFile}`);
}
generateOpenApiSpec().catch((error) => {
    console.error('Failed to generate OpenAPI spec', error);
    process.exit(1);
});
//# sourceMappingURL=generate-openapi.js.map