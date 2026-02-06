import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    create(createCourseDto: Partial<Course>) {
        const course = this.coursesRepository.create(createCourseDto);
        return this.coursesRepository.save(course);
    }

    findAll() {
        return this.coursesRepository.find({ order: { is_featured: 'DESC', created_at: 'ASC' } });
    }

    async findOne(id: number) {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async update(id: number, updateCourseDto: Partial<Course>) {
        await this.coursesRepository.update(id, updateCourseDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.coursesRepository.delete(id);
        return { deleted: true };
    }
}
