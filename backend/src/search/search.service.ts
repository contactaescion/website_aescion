import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesService } from '../courses/courses.service';
import { GalleryService } from '../gallery/gallery.service';
import { SearchLog } from './entities/search-log.entity';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(SearchLog)
        private searchLogRepo: Repository<SearchLog>,
        private readonly coursesService: CoursesService,
        private readonly galleryService: GalleryService,
    ) { }

    async search(query: string, ip?: string) {
        if (!query || query.length < 2) {
            return { courses: [], gallery: [] };
        }

        const [courses, gallery] = await Promise.all([
            this.coursesService.search(query),
            this.galleryService.search(query),
        ]);

        // Log the search
        try {
            await this.searchLogRepo.save({
                query,
                results_count: { courses: courses.length, gallery: gallery.length },
                ip_address: ip
            });
        } catch (e) {
            console.error('Failed to log search', e);
        }

        return {
            courses,
            gallery,
        };
    }
}
