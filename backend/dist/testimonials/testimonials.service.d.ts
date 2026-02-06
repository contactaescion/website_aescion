import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
export declare class TestimonialsService {
    private repo;
    constructor(repo: Repository<Testimonial>);
    create(dto: Partial<Testimonial>): Promise<Testimonial>;
    findAll(): Promise<Testimonial[]>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    update(id: number, dto: Partial<Testimonial>): Promise<Testimonial | null>;
}
