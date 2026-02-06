import { Repository } from 'typeorm';
import { GalleryImage, GalleryCategory } from './entities/gallery.entity';
import { ConfigService } from '@nestjs/config';
export declare class GalleryService {
    private galleryRepository;
    private configService;
    private s3Client;
    private bucketName;
    constructor(galleryRepository: Repository<GalleryImage>, configService: ConfigService);
    uploadFile(file: Express.Multer.File, title: string, description: string, category: GalleryCategory): Promise<GalleryImage>;
    findAll(): Promise<GalleryImage[]>;
    remove(id: number): Promise<GalleryImage>;
    update(id: number, updateDto: Partial<GalleryImage>): Promise<GalleryImage | null>;
}
