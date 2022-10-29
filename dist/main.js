"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Agendei Api')
        .setDescription('The Agendei API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        origin: ['http://localhost:3000'],
        allowedHeaders: [
            'X-Requested-With',
            'X-HTTP-Method-Override',
            'Content-Type',
            'Accept',
            'Observe',
            'X-Authorization',
            'X-Token-Auth',
            'Authorization',
        ],
        methods: 'GET, POST, PUT, DELETE, UPDATE',
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map