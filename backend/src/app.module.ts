import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { GalleryModule } from './gallery/gallery.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { User } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { GalleryImage } from './gallery/entities/gallery.entity';
import { Testimonial } from './testimonials/entities/testimonial.entity';
import { Enquiry } from './enquiries/entities/enquiry.entity';
import { PopupsModule } from './popups/popups.module';
import { Popup } from './popups/entities/popup.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [User, Course, GalleryImage, Testimonial, Enquiry, Popup],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule, UsersModule, CoursesModule, GalleryModule, TestimonialsModule, EnquiriesModule, PopupsModule, MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
