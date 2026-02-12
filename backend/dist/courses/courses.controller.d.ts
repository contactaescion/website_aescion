import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: Partial<Course>): Promise<Course>;
    findAll(page?: string, limit?: string, type?: string, q?: string): Promise<{
        items: Course[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: Partial<Course>): Promise<Course>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
