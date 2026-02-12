"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const courses_service_1 = require("./courses/courses.service");
const user_entity_1 = require("./users/entities/user.entity");
const gallery_entity_1 = require("./gallery/entities/gallery.entity");
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
    const galleryRepository = app.get('GalleryImageRepository');
    const galleryRepo = dataSource.getRepository(gallery_entity_1.GalleryImage);
    console.log('Seeding Gallery...');
    const galleryImages = [
        { title: 'Classroom', category: gallery_entity_1.GalleryCategory.CLASSROOM, public_url: '/assets/class.jpeg', s3_key: 'local-seed-class' },
        { title: 'Classroom Session', category: gallery_entity_1.GalleryCategory.CLASSROOM, public_url: '/assets/class1.jpeg', s3_key: 'local-seed-class1' },
        { title: 'Event', category: gallery_entity_1.GalleryCategory.EVENTS, public_url: '/assets/event.jpeg', s3_key: 'local-seed-event' },
        { title: 'Event Highlight', category: gallery_entity_1.GalleryCategory.EVENTS, public_url: '/assets/event1.jpeg', s3_key: 'local-seed-event1' },
        { title: 'Office Space', category: gallery_entity_1.GalleryCategory.OFFICE, public_url: '/assets/office.jpeg', s3_key: 'local-seed-office' },
        { title: 'Recruitment Drive', category: gallery_entity_1.GalleryCategory.EVENTS, public_url: '/assets/recruitment.jpeg', s3_key: 'local-seed-recruitment' },
    ];
    for (const img of galleryImages) {
        const existing = await galleryRepo.findOne({ where: { s3_key: img.s3_key } });
        if (!existing) {
            await galleryRepo.save(galleryRepo.create(img));
        }
    }
    console.log('Gallery seeded');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map