import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CoursesModule } from '../courses/courses.module';
import { GalleryModule } from '../gallery/gallery.module';

@Module({
  imports: [CoursesModule, GalleryModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
