import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: Partial<Course>): Promise<Course>;
    findAll(): Promise<Course[]>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: Partial<Course>): Promise<Course>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
