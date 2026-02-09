import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CoursesModule } from '../courses/courses.module';
import { GalleryModule } from '../gallery/gallery.module';
import { SearchLog } from './entities/search-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchLog]),
    CoursesModule,
    GalleryModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
