import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CoursesService } from './courses/courses.service';
import { UserRole } from './users/entities/user.entity';
import { GalleryImage, GalleryCategory } from './gallery/entities/gallery.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const coursesService = app.get(CoursesService);

    console.log('Seeding Users...');
    try {
        const adminEmail = 'contact.aescion@gmail.com';
        const adminPassword = 'AESCION@123'; // You should change this in production!
        await usersService.create({
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: UserRole.SUPER_ADMIN,
        });
        console.log('Admin user created');
    } catch (e) {
        console.log('Admin user likely exists');
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

    for (const c of courses) {
        try {
            await coursesService.create(c);
        } catch (e) {
            console.error('Error seeding course', c.title);
        }
    }
    console.log('Courses seeded');

    // Seed Gallery
    const galleryRepository = app.get('GalleryImageRepository'); // Accessing repo via string token might fail if not exported, better use getRepository
    // safer to use EntityManager or module reference if available, but let's try strict app.get first if we can inject a service or repo.
    // Actually, let's use the service if it has a create method for raw data, currently it expects file upload.
    // So we will use DataSource or Repository directly.
    const dataSource = app.get(DataSource);
    const galleryRepo = dataSource.getRepository(GalleryImage);

    console.log('Seeding Gallery...');
    const galleryImages = [
        { title: 'Classroom', category: GalleryCategory.CLASSROOM, public_url: '/assets/class.jpeg', s3_key: 'local-seed-class' },
        { title: 'Classroom Session', category: GalleryCategory.CLASSROOM, public_url: '/assets/class1.jpeg', s3_key: 'local-seed-class1' },
        { title: 'Event', category: GalleryCategory.EVENTS, public_url: '/assets/event.jpeg', s3_key: 'local-seed-event' },
        { title: 'Event Highlight', category: GalleryCategory.EVENTS, public_url: '/assets/event1.jpeg', s3_key: 'local-seed-event1' },
        { title: 'Office Space', category: GalleryCategory.OFFICE, public_url: '/assets/office.jpeg', s3_key: 'local-seed-office' },
        { title: 'Recruitment Drive', category: GalleryCategory.EVENTS, public_url: '/assets/recruitment.jpeg', s3_key: 'local-seed-recruitment' },
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
