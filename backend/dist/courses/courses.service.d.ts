import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
export declare class CoursesService {
    private coursesRepository;
    constructor(coursesRepository: Repository<Course>);
    create(createCourseDto: Partial<Course>): Promise<Course>;
    findAll(): Promise<Course[]>;
    findAllPaginated(options: {
        page: number;
        take: number;
        type?: string;
        q?: string;
    }): Promise<{
        items: Course[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<Course>;
    update(id: number, updateCourseDto: Partial<Course>): Promise<Course>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    search(query: string): Promise<Course[]>;
}
