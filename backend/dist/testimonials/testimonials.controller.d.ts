import { TestimonialsService } from './testimonials.service';
export declare class TestimonialsController {
    private readonly service;
    constructor(service: TestimonialsService);
    create(dto: any): Promise<import("./entities/testimonial.entity").Testimonial>;
    findAll(): Promise<import("./entities/testimonial.entity").Testimonial[]>;
    update(id: string, dto: any): Promise<import("./entities/testimonial.entity").Testimonial | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
