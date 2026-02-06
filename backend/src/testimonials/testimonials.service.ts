import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectRepository(Testimonial)
        private repo: Repository<Testimonial>,
    ) { }

    create(dto: Partial<Testimonial>) {
        return this.repo.save(this.repo.create(dto));
    }

    findAll() {
        return this.repo.find({ order: { is_featured: 'DESC', created_at: 'DESC' } });
    }

    async remove(id: number) {
        await this.repo.delete(id);
        return { deleted: true };
    }

    async update(id: number, dto: Partial<Testimonial>) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }
}
