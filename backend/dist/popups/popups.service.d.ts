import { Repository } from 'typeorm';
import { Popup } from './entities/popup.entity';
import { ConfigService } from '@nestjs/config';
export declare class PopupsService {
    private popupsRepository;
    private configService;
    private s3Client;
    private bucketName;
    constructor(popupsRepository: Repository<Popup>, configService: ConfigService);
    create(file: Express.Multer.File, title: string): Promise<Popup>;
    findAll(): Promise<Popup[]>;
    findActive(): Promise<Popup | null>;
    toggleActive(id: number): Promise<Popup>;
    remove(id: number): Promise<Popup>;
}
