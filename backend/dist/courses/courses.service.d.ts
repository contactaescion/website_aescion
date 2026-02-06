import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
export declare class CoursesService {
    private coursesRepository;
    constructor(coursesRepository: Repository<Course>);
    create(createCourseDto: Partial<Course>): Promise<Course>;
    findAll(): Promise<Course[]>;
    findOne(id: number): Promise<Course>;
    update(id: number, updateCourseDto: Partial<Course>): Promise<Course>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
