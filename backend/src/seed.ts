import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CoursesService } from './courses/courses.service';
import { UserRole } from './users/entities/user.entity';

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
        { title: 'MERN Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'MEAN Stack', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'Embedded Systems', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'IoT', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'AI & Automation', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
        { title: 'Data Analyst', duration: '3 Months', fees: '₹10,000', timing: '7:30 PM - 9:00 PM', mode: 'Offline / Online', placement_support: true },
    ];

    for (const c of courses) {
        try {
            // Simple check avoids dupes if running multiple times (naive)
            // ideally find by title
            await coursesService.create(c);
        } catch (e) {
            console.error('Error seeding course', c.title);
        }
    }
    console.log('Courses seeded');

    await app.close();
}
bootstrap();
