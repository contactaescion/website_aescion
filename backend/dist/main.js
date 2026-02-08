"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useBodyParser('json', { limit: '50mb' });
    app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const allowedOrigins = configService.get('ALLOWED_ORIGINS', 'http://localhost:5173').split(',');
    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map