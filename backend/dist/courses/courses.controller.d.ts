import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto): Promise<Course>;
    findAll(page?: string, limit?: string, type?: string, q?: string): Promise<{
        items: Course[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
