import { Injectable } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { GalleryService } from '../gallery/gallery.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly galleryService: GalleryService,
    ) { }

    async search(query: string) {
        if (!query || query.length < 2) {
            return { courses: [], gallery: [] };
        }

        const [courses, gallery] = await Promise.all([
            this.coursesService.search(query),
            this.galleryService.search(query),
        ]);

        return {
            courses,
            gallery,
        };
    }
}
