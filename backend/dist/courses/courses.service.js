"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
let CoursesService = class CoursesService {
    coursesRepository;
    constructor(coursesRepository) {
        this.coursesRepository = coursesRepository;
    }
    create(createCourseDto) {
        const course = this.coursesRepository.create(createCourseDto);
        return this.coursesRepository.save(course);
    }
    findAll() {
        return this.coursesRepository.find({ order: { is_featured: 'DESC', created_at: 'ASC' } });
    }
    async findAllPaginated(options) {
        const { page, take, type, q } = options;
        const skip = (page - 1) * take;
        const qb = this.coursesRepository.createQueryBuilder('c');
        qb.where('1=1');
        if (type)
            qb.andWhere('c.type = :type', { type });
        if (q)
            qb.andWhere('(c.title LIKE :q OR c.slug LIKE :q)', { q: `%${q}%` });
        qb.orderBy('c.is_featured', 'DESC').addOrderBy('c.created_at', 'DESC');
        qb.take(take).skip(skip);
        const [items, total] = await qb.getManyAndCount();
        const transformedItems = items.map(course => this.transformCourseImage(course));
        return { items: transformedItems, total, page, pageSize: take };
    }
    async findOne(id) {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return this.transformCourseImage(course);
    }
    async update(id, updateCourseDto) {
        await this.coursesRepository.update(id, updateCourseDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.coursesRepository.delete(id);
        return { deleted: true };
    }
    async search(query) {
        const courses = await this.coursesRepository
            .createQueryBuilder('course')
            .where('course.title LIKE :query', { query: `%${query}%` })
            .getMany();
        return courses.map(c => this.transformCourseImage(c));
    }
    transformCourseImage(course) {
        if (course.imageUrl && (course.imageUrl.includes('s3.amazonaws.com') || course.imageUrl.includes('s3') && course.imageUrl.includes('amazonaws'))) {
            const parts = course.imageUrl.split('amazonaws.com/');
            if (parts.length > 1) {
                const key = parts[1];
                const apiUrl = process.env.API_URL || 'http://localhost:3000';
                course.imageUrl = `${apiUrl}/images/proxy/${key}`;
            }
        }
        return course;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map