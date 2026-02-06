import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { GalleryImage } from './entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryImage])],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule { }
