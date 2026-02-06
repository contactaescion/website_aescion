import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    console.log('Starting reset-password script...');
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        const usersService = app.get(UsersService);
        const configService = app.get(ConfigService);

        console.log(`Connected to DB: ${configService.get('DB_DATABASE')} at ${configService.get('DB_HOST')}`);

        const allUsers = await usersService.findAll();
        console.log('--- ALL USERS ---');
        allUsers.forEach(u => console.log(`ID: ${u.id}, Email: '${u.email}', Role: ${u.role}`));
        console.log('-----------------');

        const email = 'contact.aescion@gmail.com';
        const password = 'AESCION@123';

        console.log(`Finding user ${email}...`);
        // Check case-insensitive if needed using JS find
        let user: any = await usersService.findOneByEmail(email);
        if (!user) {
            console.log('Exact match not found. Checking via iteration...');
            user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
        }

        if (!user) {
            console.log('Checking by name "Super Admin"...');
            user = allUsers.find(u => u.name === 'Super Admin') || null;
            if (user) {
                console.log(`Found user by name 'Super Admin' (ID: ${user.id}). Updating email and password...`);
                user.email = email;
            }
        }

        if (user) {
            console.log('User found. Updating password...');
            user.password = await bcrypt.hash(password, 10);
            await usersService.save(user);
            console.log('✅ Password updated successfully to: ' + password);
        } else {
            console.log('⚠️ User not found. Creating new admin user...');
            try {
                await usersService.create({
                    email: email,
                    password: password,
                    name: 'Super Admin',
                    role: UserRole.SUPER_ADMIN,
                });
                console.log('✅ Admin user created successfully with password: ' + password);
            } catch (e) {
                console.error('❌ Failed to create user:', e);
            }
        }

        await app.close();
        console.log('Script finished.');
    } catch (err) {
        console.error('❌ Script failed:', err);
    }
}
bootstrap();
