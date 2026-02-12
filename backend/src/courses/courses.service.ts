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

    async findAllPaginated(options: { page: number; take: number; type?: string; q?: string }) {
        const { page, take, type, q } = options;
        const skip = (page - 1) * take;
        const qb = this.coursesRepository.createQueryBuilder('c');
        qb.where('1=1');
        if (type) qb.andWhere('c.type = :type', { type });
        if (q) qb.andWhere('(c.title LIKE :q OR c.slug LIKE :q)', { q: `%${q}%` });
        qb.orderBy('c.is_featured', 'DESC').addOrderBy('c.created_at', 'DESC');
        qb.take(take).skip(skip);
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, pageSize: take };
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

    async search(query: string) {
        return this.coursesRepository
            .createQueryBuilder('course')
            .where('course.title LIKE :query', { query: `%${query}%` })
            .getMany();
    }
}
