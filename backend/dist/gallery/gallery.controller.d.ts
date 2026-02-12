import { GalleryService } from './gallery.service';
import { GalleryCategory } from './entities/gallery.entity';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    upload(file: Express.Multer.File, title: string, description: string, category: GalleryCategory): Promise<import("./entities/gallery.entity").GalleryImage>;
    findAll(): Promise<import("./entities/gallery.entity").GalleryImage[]>;
    remove(id: string): Promise<import("./entities/gallery.entity").GalleryImage>;
    update(id: string, updateDto: any): Promise<import("./entities/gallery.entity").GalleryImage>;
    presign(key: string): Promise<{
        error: string;
        url?: undefined;
    } | {
        url: string;
        error?: undefined;
    }>;
}
