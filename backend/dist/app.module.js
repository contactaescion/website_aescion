"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const gallery_module_1 = require("./gallery/gallery.module");
const testimonials_module_1 = require("./testimonials/testimonials.module");
const enquiries_module_1 = require("./enquiries/enquiries.module");
const user_entity_1 = require("./users/entities/user.entity");
const course_entity_1 = require("./courses/entities/course.entity");
const gallery_entity_1 = require("./gallery/entities/gallery.entity");
const testimonial_entity_1 = require("./testimonials/entities/testimonial.entity");
const enquiry_entity_1 = require("./enquiries/entities/enquiry.entity");
const popups_module_1 = require("./popups/popups.module");
const popup_entity_1 = require("./popups/entities/popup.entity");
const mail_module_1 = require("./mail/mail.module");
const analytics_module_1 = require("./analytics/analytics.module");
const visitor_log_entity_1 = require("./analytics/entities/visitor-log.entity");
const search_module_1 = require("./search/search.module");
const images_module_1 = require("./images/images.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const isSqlite = config.get('DB_TYPE') === 'sqlite';
                    if (isSqlite) {
                        return {
                            type: 'sqlite',
                            database: (0, path_1.join)(process.cwd(), 'database.sqlite'),
                            entities: [user_entity_1.User, course_entity_1.Course, gallery_entity_1.GalleryImage, testimonial_entity_1.Testimonial, enquiry_entity_1.Enquiry, popup_entity_1.Popup, visitor_log_entity_1.VisitorLog],
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'mysql',
                        host: config.get('DB_HOST'),
                        port: config.get('DB_PORT'),
                        username: config.get('DB_USERNAME'),
                        password: config.get('DB_PASSWORD'),
                        database: config.get('DB_DATABASE'),
                        entities: [user_entity_1.User, course_entity_1.Course, gallery_entity_1.GalleryImage, testimonial_entity_1.Testimonial, enquiry_entity_1.Enquiry, popup_entity_1.Popup, visitor_log_entity_1.VisitorLog],
                        synchronize: config.get('NODE_ENV') !== 'production',
                        ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
                    };
                },
            }),
            auth_module_1.AuthModule, users_module_1.UsersModule, courses_module_1.CoursesModule, gallery_module_1.GalleryModule, testimonials_module_1.TestimonialsModule, enquiries_module_1.EnquiriesModule, popups_module_1.PopupsModule, mail_module_1.MailModule, analytics_module_1.AnalyticsModule, search_module_1.SearchModule, images_module_1.ImagesModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map