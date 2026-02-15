"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const courses_service_1 = require("./courses/courses.service");
const user_entity_1 = require("./users/entities/user.entity");
const course_entity_1 = require("./courses/entities/course.entity");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const coursesService = app.get(courses_service_1.CoursesService);
    console.log('Seeding Users...');
    console.log('Seeding Users...');
    const adminEmail = 'contact.aescion@gmail.com';
    const adminPassword = 'AESCION@123';
    let adminUser = await usersService.findOneByEmail(adminEmail);
    if (adminUser) {
        console.log('Admin user exists, skipping password reset...');
        if (adminUser.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            adminUser.role = user_entity_1.UserRole.SUPER_ADMIN;
            await usersService.save(adminUser);
        }
    }
    else {
        console.log('Creating Admin user...');
        await usersService.create({
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: user_entity_1.UserRole.SUPER_ADMIN,
        });
        console.log('Admin user created');
    }
    console.log('Seeding Courses...');
    const courses = [
        { title: 'Python Full Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'Java Full Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true, trainer_name: 'Angel', trainer_experience: '10+ years', is_featured: true },
        { title: 'Embedded Systems', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'IoT', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'MERN Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'MEAN Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
    ];
    const dataSource = app.get(typeorm_1.DataSource);
    const courseRepo = dataSource.getRepository(course_entity_1.Course);
    for (const c of courses) {
        try {
            const existing = await courseRepo.findOne({ where: { title: c.title } });
            if (!existing) {
                await coursesService.create(c);
                console.log(`Seeded course: ${c.title}`);
            }
        }
        catch (e) {
            console.error('Error seeding course', c.title);
        }
    }
    console.log('Courses seeded');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map