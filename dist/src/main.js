"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ferretería API')
        .setDescription('API para catálogo, inventario, compras y ventas')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, doc);
    const port = Number(process.env.PORT ?? 3000);
    const host = '0.0.0.0';
    await app.listen(port, host);
    console.log(`✅ API viva:  http://localhost:${port}  |  📚 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map